"""Check the public file boundary using Git's index and ignore rules; never read private data."""
import json
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent

def git(*args, input=None):
    return subprocess.check_output(['git', *args], cwd=ROOT, input=input, text=True, encoding='utf-8')

files = git('ls-files', '-z').split('\0')
files = [name for name in files if name]
assert files, 'Stage the reviewed release files before running this check.'
blocked = {'.runtime', '__pycache__', 'node_modules', '.venv', 'private', 'backups', 'exports', 'drafts', 'resumes', 'attachments', 'mail', 'inbox'}
private_suffixes = {'.pdf', '.docx', '.doc', '.eml', '.msg', '.mbox', '.pst', '.sqlite', '.sqlite3', '.db', '.log', '.pem', '.key'}
for name in files:
    path = Path(name)
    assert not set(path.parts) & blocked, f'Private/runtime path staged: {name}'
    assert not (path.name.startswith('.env') and path.name != '.env.example'), f'Local environment staged: {name}'
    assert path.suffix.lower() not in private_suffixes, f'Personal document/database staged: {name}'
    if path.suffix in {'.py', '.mjs', '.js', '.json', '.md', '.ps1', '.cmd', '.yml', '.html', '.css'} and 'vendor' not in path.parts:
        text = (ROOT / name).read_text(encoding='utf-8-sig')
        assert not re.search(r'(?:github_pat_|gh[pousr]_)[A-Za-z0-9_]{24,}', text), f'Possible credential in: {name}'
        assert not re.search(r'[A-Za-z]:[/\\]Users[/\\][^/\\\s\x27\x22]+[/\\]', text), f'Developer home path in: {name}'

for name in ('.env', '.env.local', '.runtime/server.json', 'data/private/record.json', 'exports/personal.json', 'drafts/SOP.md', 'my-cv.pdf', 'letters.docx', 'mail/thread.eml', 'local.sqlite3'):
    ignored = subprocess.run(['git', 'check-ignore', '--quiet', '--no-index', name], cwd=ROOT).returncode
    assert ignored == 0, f'Unprotected private path: {name}'
assert 'examples/backup.example.json' in files
for path in (ROOT / 'examples').glob('*.json'):
    json.loads(path.read_text(encoding='utf-8'))
for paper in json.loads((ROOT / 'dist/literature-seed.json').read_text(encoding='utf-8')):
    assert not paper.get('abstract') and not paper.get('summaryZh'), 'Publisher abstracts must stay in private runtime cache.'
print(f'Release boundary passed: {len(files)} reviewed public files, private paths ignored, metadata-only paper seeds.')
