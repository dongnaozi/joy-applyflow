#!/usr/bin/env python3
"""Local static workbench plus bounded, evidence-preserving publisher RSS tracking."""
from __future__ import annotations

import argparse
import copy
import hashlib
import html
import json
import re
import threading
import unicodedata
import xml.etree.ElementTree as ET
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timedelta, timezone
from email.utils import parsedate_to_datetime
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.error import HTTPError
from urllib.parse import parse_qs, unquote, urlparse
from urllib.request import Request, urlopen

from config import CONFIG, validate_port

ROOT = Path(__file__).resolve().parent
SOURCES = json.loads((ROOT / 'literature_sources.json').read_text(encoding='utf-8'))
JOURNALS = {s['journal'] for s in SOURCES}
WINDOW_DAYS = 90
TTL = 6 * 3600
MAX_BYTES = 5 * 1024 * 1024
MARKER = 'catalyst-atlas-local-workbench-v2'


def today_china():
    return datetime.now(timezone(timedelta(hours=8))).date()


def now_iso():
    return datetime.now(timezone.utc).isoformat(timespec='seconds')


def clean(value):
    return re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]*>', ' ', value or ''))).strip()


def normalized(value):
    return clean(value).translate(str.maketrans('₀₁₂₃₄₅₆₇₈₉', '0123456789')).lower()


def keyword_text(value):
    text = unicodedata.normalize('NFKC', re.sub(r'\s+', ' ', str(value or ''))).lower().strip()
    text = re.sub(r'\bco\s*2\s*rr\b', 'co2rr', text)
    return re.sub(r'\bco\s*2\b', 'co2', text)


def keyword_terms(values):
    if len(values) > 20 or any(not isinstance(v, str) or len(v) > 80 for v in values):
        raise ValueError('关键词分别最多 20 项，每项最多 80 个字符。')
    return list(dict.fromkeys(keyword_text(v) for v in values if v.strip()))


def has_keyword(text, term):
    if re.fullmatch(r'[a-z][a-z0-9+-]{0,5}', term):
        return bool(re.search(r'(?<![a-z0-9])' + re.escape(term) + r'(?![a-z0-9])', text))
    return term in text


def matches_keywords(paper, keywords=(), excludes=()):
    text = keyword_text(' '.join([paper.get('title', ''), paper.get('abstract', ''), paper.get('summaryZh', ''), *paper.get('topics', [])]))
    return (not keywords or any(has_keyword(text, term) for term in keywords)) and not any(has_keyword(text, term) for term in excludes)


def relevant(title, abstract=''):
    title, abstract = normalized(title), normalized(abstract)
    carbon = r'(?:\bco\s*2\b|carbon\s+dioxide)'
    reaction = r'(?:electroreduc\w*|electroly[sz](?:is|er)\w*|reduction)'
    direct = (r'\be?co\s*2\s*rr\b|' + carbon + r'\s+(?:(?:electrochemical|electrocatalytic|aqueous|acidic)\s+){0,2}' + reaction
              + r'|' + r'(?:electroreduc\w*|electro(?:chemical|catalytic)\s+(?:co-?reduction|coreduction|reduction|conversion))\s+(?:of\s+)?' + carbon
              + r'|' + carbon + r'\s+(?:is\s+)?electrochemically\s+reduced')
    text = title + ' ' + abstract
    electro = re.search(r'electro(?:reduc|chem|catal|lysis)|\be?co\s*2\s*rr\b', text)
    # ponytail: explicit phrases plus the opening abstract screen candidates;
    # a semantic classifier is warranted only if this conservative rule misses too much.
    opening = re.split(r'more broadly|potential applications|future applications', abstract, maxsplit=1)[0][:1200]
    context = re.search(direct, title) or re.search(direct, opening)
    # CO2/nitrate co-reduction remains in scope but gets its own topic label.
    urea_coreduction = 'urea' in title and re.search(carbon + r'.{0,85}?(?:co[-‐‑–]?reduction|coreduction)', abstract)
    return bool(electro and (context or urea_coreduction))


def topic_tags(value):
    text = normalized(value)
    tags = []
    for tag, pattern in [('铜基催化', r'\bcopper\b|\bcu\b'), ('多碳产物', r'multi.?carbon|c2\+|ethylene|ethanol'), ('碳氮耦合', r'urea|c[-‐‑–─]?n\s+coupling'), ('界面与机理', r'interface|mechanism|intermediate|operando'), ('电解槽与反应器', r'electroly[sz]er|flow.cell|membrane|reactor'), ('酸性体系', r'acidic|\bacid\b'), ('分子与单原子', r'single.atom|molecular|porphyrin'), ('氧还原与过氧化氢', r'oxygen.reduction|\borr\b|hydrogen.peroxide'), ('析氢与制氢', r'hydrogen.evolution|hydrogen.production|\bher\b'), ('电池与储能', r'\bbatter(?:y|ies)\b|lithium.ion|solid.state')]:
        if re.search(pattern, text):
            tags.append(tag)
    return tags


def date_iso(value):
    value = clean(value)
    try:
        date = datetime.fromisoformat(value.replace('Z', '+00:00'))
    except ValueError:
        try:
            date = parsedate_to_datetime(value)
        except (TypeError, ValueError):
            return ''
    return date.date().isoformat()


def article_doi(*values):
    for value in values:
        match = re.search(r'10\.\d{4,9}/[^\s<>"?#]+', unquote(html.unescape(str(value))), re.I)
        if match:
            return match.group(0).rstrip('.,;)').lower()
    return ''


def node_text(node):
    return ''.join(node.itertext()) if node is not None else ''


def parse_feed(payload, source, today=None, all_candidates=False):
    """RSS 1/2 and Atom. RSS cannot establish corresponding author identity."""
    root = ET.fromstring(payload)
    if root.tag.rsplit('}', 1)[-1].lower() not in {'rss', 'rdf', 'feed'}:
        raise ValueError('返回内容不是 RSS/Atom，可能是登录或验证页面')
    today = today or today_china()
    earliest = (today - timedelta(days=WINDOW_DAYS)).isoformat()
    output = []
    for item in root.iter():
        if item.tag.rsplit('}', 1)[-1] not in {'item', 'entry'}:
            continue
        fields = {}
        for child in item:
            fields.setdefault(child.tag.rsplit('}', 1)[-1], []).append(child)
        def values(key):
            return [node_text(v) for v in fields.get(key, [])]
        def first(*keys):
            return next((v for key in keys for v in values(key) if v.strip()), '')
        title = clean(first('title'))
        abstract = clean(first('encoded', 'description', 'summary', 'content'))
        # Atom updated is an edit date, never evidence of first publication.
        date = date_iso(first('published', 'date', 'pubDate'))
        if not title or not date or not earliest <= date <= today.isoformat() or (not all_candidates and not relevant(title, abstract)):
            continue
        links = fields.get('link', [])
        url = next((v.attrib.get('href') or node_text(v) for v in links if v.attrib.get('rel', 'alternate') == 'alternate'), '')
        url = clean(url)
        if urlparse(url).scheme not in {'http', 'https'}:
            continue
        doi = article_doi(first('doi', 'identifier', 'guid', 'id'), url)
        authors = []
        author_values = values('creator') + [next((node_text(child) for child in node if child.tag.rsplit('}', 1)[-1] == 'name'), node_text(node)) for node in fields.get('author', [])]
        for value in author_values:
            authors.extend(clean(v) for v in re.split(r'\s*;\s*', value) if clean(v))
        key = doi or hashlib.sha256(normalized(title).encode()).hexdigest()[:20]
        output.append({'id': key, 'title': title, 'journal': source['journal'], 'date': date,
                       'url': 'https://doi.org/' + doi if doi else url, 'doi': doi,
                       'authors': list(dict.fromkeys(authors)), 'abstract': abstract,
                       'abstractSource': 'Publisher RSS' if abstract else '',
                       'correspondingAuthors': [], 'topics': topic_tags(title + ' ' + abstract),
                       'sourceUrls': list(dict.fromkeys([source['url'], url])),
                       'evidenceStatus': 'RSS 元数据；通讯作者待核实'})
    return sorted(output, key=lambda p: p['date'], reverse=True)[:250] if all_candidates else output


def merge_papers(papers, curated=()):
    result = {}
    for paper in list(papers) + list(curated):
        if paper.get('journal') not in JOURNALS or not paper.get('title'):
            continue
        key = article_doi(paper.get('doi', ''), paper.get('url', '')) or normalized(paper['title'])
        current = result.get(key)
        if not current:
            result[key] = copy.deepcopy(paper)
            continue
        # Curated metadata augments feeds without losing verified correspondence.
        merged = dict(current)
        for field, value in paper.items():
            if value and (field != 'correspondingAuthors' or value):
                merged[field] = copy.deepcopy(value)
        merged['sourceUrls'] = list(dict.fromkeys(current.get('sourceUrls', []) + paper.get('sourceUrls', [])))
        if current.get('correspondingAuthors') and not paper.get('correspondingAuthors'):
            merged['correspondingAuthors'] = copy.deepcopy(current['correspondingAuthors'])
        if paper.get('summaryZh') and current.get('abstract'):
            merged['abstract'] = current['abstract']
            merged['abstractSource'] = current.get('abstractSource', '')
        result[key] = merged
    return sorted(result.values(), key=lambda p: (p.get('date', ''), p['title']), reverse=True)[:500]


def screened_cache(papers, cutoff, keywords=(), excludes=()):
    return [{**p, 'topics': topic_tags(p.get('title', '') + ' ' + p.get('abstract', ''))}
            for p in papers if p.get('date', '') >= cutoff and (bool(keywords) or relevant(p.get('title', ''), p.get('abstract', ''))) and matches_keywords(p, keywords, excludes)]


def fetch_source(source):
    request = Request(source['url'], headers={'User-Agent': 'CO2RR-Workbench/1.0 (personal research RSS reader)', 'Accept': 'application/rss+xml, application/atom+xml, application/xml, text/xml'})
    with urlopen(request, timeout=12) as response:
        payload = response.read(MAX_BYTES + 1)
        if len(payload) > MAX_BYTES:
            raise ValueError('RSS 超过 5 MB 限制')
    return parse_feed(payload, source, all_candidates=True)


class Literature:
    def __init__(self, site_root):
        self.site_root = Path(site_root)
        self.cache_path = CONFIG.literature_cache
        self.lock = threading.Lock()
        self.refreshing = False
        self.updated_at = ''
        self.last_checked_at = ''
        self.by_source = {}
        self.cache_format = 1
        try:
            cache = json.loads(self.cache_path.read_text(encoding='utf-8'))
            self.by_source = {key: value for key, value in cache.get('sources', {}).items() if key in {s['id'] for s in SOURCES}}
            self.updated_at = cache.get('updatedAt', '')
            self.last_checked_at = cache.get('lastCheckedAt', self.updated_at)
            self.cache_format = 2 if cache.get('format') == 2 else 1
        except (OSError, ValueError, TypeError):
            pass

    def seeds(self):
        try:
            data = json.loads((self.site_root / 'literature-seed.json').read_text(encoding='utf-8-sig'))
            return data if isinstance(data, list) else data.get('papers', [])
        except (OSError, ValueError):
            return []

    def snapshot(self, refresh=False, keywords=(), excludes=()):
        keywords, excludes = keyword_terms(keywords), keyword_terms(excludes)
        with self.lock:
            try:
                stale = (datetime.now(timezone.utc) - datetime.fromisoformat(self.last_checked_at)).total_seconds() > TTL
            except (ValueError, TypeError):
                stale = True
            if (refresh or stale or self.cache_format < 2) and not self.refreshing:
                self.refreshing = True
                threading.Thread(target=self.refresh, daemon=True).start()
            sources = []
            papers = []
            cutoff = (today_china() - timedelta(days=WINDOW_DAYS)).isoformat()
            for source in SOURCES:
                saved = self.by_source.get(source['id'], {})
                retained = screened_cache(saved.get('papers', []), cutoff, keywords, excludes)
                papers.extend(retained)
                sources.append({**source, 'status': saved.get('status', 'pending'), 'lastSuccess': saved.get('lastSuccess', ''),
                                'error': saved.get('error', ''), 'count': len(retained), 'rawReady': saved.get('rawReady', False)})
            ok = sum(s['status'] == 'ok' for s in sources)
            selected_keys = {article_doi(p.get('doi', ''), p.get('url', '')) or normalized(p['title']) for p in papers}
            curated = [p for p in self.seeds() if (article_doi(p.get('doi', ''), p.get('url', '')) or normalized(p['title'])) in selected_keys or matches_keywords(p, keywords, excludes)]
            selected = [p for p in merge_papers(papers, curated) if matches_keywords(p, keywords, excludes)]
            raw_count = sum(s['rawReady'] for s in sources)
            result = {'status': 'ready' if ok == len(SOURCES) else 'partial' if ok else 'seed' if curated else 'unavailable',
                      'updatedAt': self.updated_at, 'lastCheckedAt': self.last_checked_at, 'refreshing': self.refreshing, 'windowDays': WINDOW_DAYS,
                      'sources': sources, 'papers': selected,
                      'researchMode': 'keywords' if keywords else 'co2rr', 'rawCoverage': {'ready': raw_count, 'total': len(SOURCES)},
                      'coverageNote': '部分期刊的全主题缓存尚未就绪；当前主题结果可能不完整，可更新文献后查看。' if keywords and raw_count < len(SOURCES) else ''}
            return result

    def refresh(self):
        successes = 0
        try:
            # ponytail: 4 bounded workers suffice for 12 feeds; no task queue needed.
            with ThreadPoolExecutor(max_workers=4) as pool:
                futures = {pool.submit(fetch_source, source): source for source in SOURCES}
                for future in as_completed(futures):
                    source = futures[future]
                    with self.lock:
                        previous = self.by_source.get(source['id'], {})
                    try:
                        fetched = future.result()
                        successes += 1
                        cutoff = (today_china() - timedelta(days=WINDOW_DAYS)).isoformat()
                        # ponytail: keep at most 250 recent RSS records per journal; historical search needs a separate index.
                        retained = [p for p in previous.get('papers', []) if p.get('date', '') >= cutoff]
                        entry = {'status': 'ok', 'lastSuccess': now_iso(), 'error': '', 'rawReady': True, 'papers': merge_papers(retained + fetched)[:250]}
                    except Exception as error:
                        reason = f'HTTP {error.code}' if isinstance(error, HTTPError) else clean(str(error))[:200]
                        entry = {**previous, 'status': 'stale' if previous.get('papers') else 'error', 'error': reason, 'papers': previous.get('papers', [])}
                    with self.lock:
                        self.by_source[source['id']] = entry
            with self.lock:
                self.last_checked_at = now_iso()
                self.cache_format = 2
                if successes:
                    self.updated_at = self.last_checked_at
                self.cache_path.parent.mkdir(parents=True, exist_ok=True)
                temporary = self.cache_path.with_suffix('.tmp')
                temporary.write_text(json.dumps({'format': self.cache_format, 'updatedAt': self.updated_at, 'lastCheckedAt': self.last_checked_at, 'sources': self.by_source}, ensure_ascii=False), encoding='utf-8')
                temporary.replace(self.cache_path)
        finally:
            with self.lock:
                self.refreshing = False


class Handler(SimpleHTTPRequestHandler):
    literature = None
    mentor_import_lock = threading.Lock()

    def send_json(self, value, code=200):
        payload = json.dumps(value, ensure_ascii=False).encode('utf-8')
        self.send_response(code)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(payload)))
        self.send_header('Cache-Control', 'no-store')
        self.send_header('X-Content-Type-Options', 'nosniff')
        self.end_headers()
        self.wfile.write(payload)

    def do_GET(self):
        path = urlparse(self.path)
        if path.path == '/api/health':
            return self.send_json({'id': MARKER})
        if path.path == '/api/models':
            from ollama_client import list_models
            return self.send_json(list_models())
        if path.path == '/api/literature':
            try:
                query = parse_qs(path.query, max_num_fields=50)
                return self.send_json(self.literature.snapshot(query.get('refresh') == ['1'], query.get('kw', []), query.get('exclude', [])))
            except ValueError as error:
                return self.send_json({'error': str(error)}, 400)
        if path.path.startswith('/api/'):
            return self.send_json({'error': 'Unknown endpoint'}, 404)
        return super().do_GET()

    def do_POST(self):
        endpoint = urlparse(self.path).path
        if endpoint not in ('/api/mentor/import', '/api/models/test'):
            return self.send_json({'error': 'Unknown endpoint'}, 404)
        origin = f'http://127.0.0.1:{self.server.server_port}'
        if self.headers.get('Host') != origin.removeprefix('http://') or self.headers.get('Origin', origin) != origin:
            return self.send_json({'error': '请从本机工作台提交本地模型请求。'}, 403)
        if self.headers.get('Content-Type', '').split(';')[0].strip().lower() != 'application/json':
            return self.send_json({'error': '请求需要 JSON 数据。'}, 415)
        try:
            length = int(self.headers.get('Content-Length', '0'))
            if not 0 < length <= 200000:
                return self.send_json({'error': '页面正文过长，请缩短至 200 KB 以内。'}, 413)
            body = json.loads(self.rfile.read(length).decode('utf-8'))
            if not isinstance(body, dict):
                raise ValueError('请求需要 JSON 对象。')
            from ollama_client import DEFAULT_MODEL, OllamaError, test_model, validate_model
            model = validate_model(body.get('model', DEFAULT_MODEL))
            if endpoint == '/api/mentor/import' and (not isinstance(body.get('url'), str) or not isinstance(body.get('page_text', ''), str)):
                raise ValueError('请填写导师官网链接和公开页面正文。')
        except (ValueError, UnicodeError) as error:
            return self.send_json({'error': str(error)}, 400)
        if not self.mentor_import_lock.acquire(blocking=False):
            return self.send_json({'error': '已有一项本地模型请求正在进行，请稍后再试。'}, 429)
        try:
            if endpoint == '/api/models/test':
                return self.send_json(test_model(model))
            from mentor_import import import_mentor
            self.send_json(import_mentor(body['url'], body.get('page_text', ''), model))
        except OllamaError as error:
            self.send_json({'ok': False, 'model': model, 'message': str(error), 'error': str(error), 'code': error.code}, 503)
        except ValueError as error:
            self.send_json({'error': str(error), 'code': getattr(error, 'code', 'invalid_input')}, 400)
        except Exception as error:
            self.log_error('Mentor import failed: %s', type(error).__name__)
            self.send_json({'error': '识别服务暂时不可用，请稍后重试。'}, 503)
        finally:
            self.mentor_import_lock.release()

    def list_directory(self, path):
        self.send_error(403, 'Directory listing disabled')
        return None

    def translate_path(self, path):
        resolved = Path(super().translate_path(path)).resolve()
        root = Path(self.directory).resolve()
        if not resolved.is_relative_to(root):
            return str(root / '__blocked__')
        return str(resolved)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--port', type=validate_port, default=CONFIG.port)
    parser.add_argument('--bind', choices=['127.0.0.1'], default=CONFIG.bind)
    parser.add_argument('--directory', type=Path, default=ROOT / 'dist')
    args = parser.parse_args()
    site_root = args.directory.resolve()
    if site_root != ROOT / 'dist':
        parser.error('Only the project dist directory can be served')
    Handler.literature = Literature(site_root)
    ThreadingHTTPServer((args.bind, args.port), partial(Handler, directory=str(site_root))).serve_forever()


if __name__ == '__main__':
    main()
