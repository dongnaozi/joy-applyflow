"""One stdlib check for feed trust boundaries, dates, and evidence-preserving merge."""
from datetime import date
from pathlib import Path
from tempfile import TemporaryDirectory
from unittest.mock import patch
from server import parse_feed, merge_papers, relevant, screened_cache, topic_tags, SOURCES, Literature, ROOT, matches_keywords, keyword_terms

source = next(s for s in SOURCES if s['id'] == 'natcatal')
rss = b'''<rss xmlns:dc="http://purl.org/dc/elements/1.1/"><channel>
<item><title>Copper CO2 electroreduction to ethylene</title><link>https://www.nature.com/articles/test</link><dc:identifier>doi:10.1038/example</dc:identifier><dc:date>2026-10-01</dc:date><dc:creator>Alice Chen</dc:creator><description>&lt;p&gt;Copper catalysis in a flow cell.&lt;/p&gt;</description></item>
<item><title>Carbon dioxide thermal conversion</title><link>https://example.org/thermal</link><pubDate>Thu, 01 Oct 2026 12:00:00 GMT</pubDate><description>Thermocatalysis without electrochemistry.</description></item>
<item><title>CO2 electroreduction</title><link>https://example.org/old</link><dc:date>2025-10-01</dc:date></item>
<item><title>CO2 electroreduction</title><link>https://example.org/future</link><dc:date>2027-10-01</dc:date></item>
<item><title>CO2 electroreduction</title><link>javascript:alert(1)</link><dc:date>2026-10-01</dc:date></item>
</channel></rss>'''
# "Electrochemistry" in a negative sentence is still keyword candidate screening,
# so the unrelated control has no electrochemical word at all.
rss = rss.replace(b'Thermocatalysis without electrochemistry.', b'Thermocatalysis under high temperature.')
papers = parse_feed(rss, source, date(2026, 10, 28))
assert len(papers) == 1
assert papers[0]['doi'] == '10.1038/example'
assert papers[0]['authors'] == ['Alice Chen']
assert papers[0]['abstract'] == 'Copper catalysis in a flow cell.'
assert papers[0]['correspondingAuthors'] == []
assert '多碳产物' in papers[0]['topics']
assert relevant('CO2RR in acidic electrolyzers')
assert relevant('Carbon dioxide electrocatalytic reduction')
assert not relevant('A battery cell for electrochemical direct air capture of CO2')
assert not relevant('Photocatalytic carbon dioxide reduction')
assert not relevant('Electrochemical hydrogen evolution')
quinone_title = 'Redox-Gated Molecular Switching of CO2 Self-Poisoning on Quinone Electrocatalysts Enables In Situ Self-Regeneration'
quinone_abstract = ('Oxygen reduction produces peroxide for wastewater treatment. Carbon dioxide binds to the catalyst and inhibits its activity. Oxidative pulses restore the surface. More broadly, future applications might include CO2 electrolysis.')
assert not relevant(quinone_title, quinone_abstract)
assert screened_cache([{**papers[0], 'title': quinone_title, 'abstract': quinone_abstract}], '2026-07-01') == []
assert relevant('Reversible Breathing for Urea Electrosynthesis', 'Here we construct dual-atom sites for electrochemical coreduction of CO 2 and nitrate to synthesize urea.')
assert '碳氮耦合' in topic_tags('CO2 and nitrate co-reduction for urea electrosynthesis')
verified = {**papers[0], 'summaryZh': '已核实摘要', 'correspondingAuthors': [{'name': 'Alice Chen', 'affiliations': ['Example University'], 'sourceUrl': 'https://www.nature.com/articles/test', 'verified': True}]}
merged = merge_papers(papers, [verified])
assert len(merged) == 1 and merged[0]['correspondingAuthors'][0]['name'] == 'Alice Chen'
assert merge_papers([verified], papers)[0]['correspondingAuthors'][0]['name'] == 'Alice Chen'
assert not merge_papers([{**papers[0], 'journal': 'Unapproved Journal'}])
atom = b'''<feed xmlns="http://www.w3.org/2005/Atom"><entry><title>Electrochemical carbon dioxide reduction</title><published>2026-10-03T10:00:00Z</published><link rel="alternate" href="https://doi.org/10.1038/atom"/><author><name>Bob Li</name><uri>https://orcid.org/example</uri></author><summary>Interface mechanism</summary></entry></feed>'''
assert parse_feed(atom, source, date(2026, 10, 28))[0]['authors'] == ['Bob Li']
assert parse_feed(atom.replace(b'<published>', b'<updated>').replace(b'</published>', b'</updated>'), source, date(2026, 10, 28)) == []
runtime_root = ROOT / '.runtime'
runtime_root.mkdir(exist_ok=True)
with TemporaryDirectory(dir=runtime_root, prefix='literature-check-') as folder:
    assert Path(folder).resolve().is_relative_to(runtime_root.resolve())
    tracker = Literature(ROOT / 'dist')
    tracker.cache_path = Path(folder) / 'cache.json'
    tracker.updated_at = '2026-10-01T00:00:00+00:00'
    tracker.by_source = {source['id']: {'status': 'ok', 'lastSuccess': tracker.updated_at, 'papers': papers}}
    with patch('server.fetch_source', side_effect=OSError('test offline')):
        tracker.refresh()
    assert tracker.updated_at == '2026-10-01T00:00:00+00:00'
    assert tracker.last_checked_at and tracker.by_source[source['id']]['status'] == 'stale'
    assert tracker.by_source[source['id']]['papers'] == papers
orr = b'<item><title>Oxygen reduction on quinone catalysts</title><link>https://doi.org/10.1038/orr-test</link><pubDate>Fri, 02 Oct 2026 12:00:00 GMT</pubDate><description>Hydrogen peroxide production through oxygen reduction.</description></item>'
mixed = rss.replace(b'</channel>', orr + b'</channel>')
raw = parse_feed(mixed, source, date(2026, 10, 28), all_candidates=True)
assert len(raw) == 3
assert len(parse_feed(mixed, source, date(2026, 10, 28))) == 1
selected = screened_cache(raw, '2026-07-01', keyword_terms(['oxygen reduction']))
assert len(selected) == 1 and selected[0]['doi'] == '10.1038/orr-test'
assert not screened_cache(raw, '2026-07-01', keyword_terms(['oxygen reduction']), keyword_terms(['peroxide']))
assert not matches_keywords({'title': 'Other chemistry'}, keyword_terms(['HER']))
assert matches_keywords({'title': 'CO 2 RR in a flow cell'}, keyword_terms(['CO2RR']))
assert 'CO₂电还原' not in topic_tags('Hydrogen evolution on a new material')
tracker = Literature(ROOT / 'dist')
tracker.cache_format = 2
tracker.refreshing = True  # snapshots remain read-only during this check; no network call.
tracker.by_source = {source['id']: {'status': 'ok', 'rawReady': True, 'papers': raw}}
tracker.seeds = lambda: []
assert len(tracker.snapshot(keywords=['oxygen reduction'])['papers']) == 1
assert len(tracker.snapshot()['papers']) == 1
assert len(tracker.snapshot(keywords=['oxygen reduction'], excludes=['peroxide'])['papers']) == 0
assert tracker.snapshot(keywords=['oxygen reduction'])['coverageNote']
assert len(tracker.by_source[source['id']]['papers']) == 3
tracker.seeds = lambda: [{**verified, 'abstract': '人工整理的中文摘要', 'summaryZh': '人工整理的中文摘要'}]
selected = tracker.snapshot(keywords=['flow cell'])['papers']
assert len(selected) == 1 and 'flow cell' in selected[0]['abstract']
assert selected[0]['correspondingAuthors'][0]['name'] == 'Alice Chen'
print('Literature checks passed: default/custom topics, exclusions, raw cache, dates, DOI dedup and correspondence evidence.')
