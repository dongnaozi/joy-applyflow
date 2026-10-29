"""Small, literal .env configuration shared by the server and Windows launcher."""
from __future__ import annotations

import json
import os
import re
import sys
from dataclasses import dataclass
from pathlib import Path

ROOT = Path(__file__).resolve().parent
MODELS = ('deepseek-r1:1.5b', 'deepseek-r1:7b')


def read_dotenv(path):
    """Read KEY=value, optional quotes/comments; never execute or expand values."""
    try:
        lines = Path(path).read_text(encoding='utf-8-sig').splitlines()
    except FileNotFoundError:
        return {}
    values = {}
    for number, line in enumerate(lines, 1):
        line = line.strip()
        if not line or line.startswith('#'):
            continue
        match = re.fullmatch(r'([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)', line)
        if not match:
            raise ValueError(f'{path}:{number}: expected KEY=value')
        key, value = match.groups()
        if value.startswith(('"', "'")):
            quoted = re.fullmatch(r'([\'\"])(.*?)\1\s*(?:#.*)?', value)
            if not quoted:
                raise ValueError(f'{path}:{number}: invalid quoted value')
            value = quoted.group(2)
        else:
            value = re.split(r'\s+#', value, maxsplit=1)[0].rstrip()
        values[key] = value
    return values


def validate_port(value):
    if not re.fullmatch(r'[0-9]+', str(value)) or not 1 <= int(value) <= 65535:
        raise ValueError('APP_PORT must be an integer from 1 to 65535')
    return int(value)


def default_private_dir(environ, platform):
    if platform == 'win32':
        base = Path(environ.get('APPDATA') or Path.home() / 'AppData' / 'Roaming')
    elif platform == 'darwin':
        base = Path.home() / 'Library' / 'Application Support'
    else:
        base = Path(environ.get('XDG_STATE_HOME') or Path.home() / '.local' / 'state')
    return base / 'joy-applyflow' / 'private'


@dataclass(frozen=True)
class Settings:
    port: int
    bind: str
    private_dir: Path
    ollama_default_model: str
    ollama_base_url: str

    @property
    def literature_cache(self):
        return self.private_dir / 'cache' / 'literature-cache.json'


def load_config(*, root=ROOT, environ=None, platform=None):
    root = Path(root).resolve()
    environ = os.environ if environ is None else environ
    values = {**read_dotenv(root / '.env'), **environ}
    port = validate_port(values.get('APP_PORT', '8792'))
    bind = values.get('APP_BIND', '127.0.0.1')
    if bind != '127.0.0.1':
        raise ValueError('APP_BIND must be 127.0.0.1; this workbench is local only')
    model = values.get('OLLAMA_DEFAULT_MODEL', MODELS[0])
    if model not in MODELS:
        raise ValueError('OLLAMA_DEFAULT_MODEL must be deepseek-r1:1.5b or deepseek-r1:7b')
    base_url = values.get('OLLAMA_BASE_URL', 'http://localhost:11434/v1').rstrip('/')
    if base_url not in ('http://localhost:11434/v1', 'http://127.0.0.1:11434/v1'):
        raise ValueError('OLLAMA_BASE_URL must use localhost or 127.0.0.1 at http port 11434 and /v1')
    private_value = values.get('APP_PRIVATE_DIR', '').strip()
    private_dir = Path(private_value).expanduser() if private_value else default_private_dir(environ, platform or sys.platform)
    if not private_dir.is_absolute():
        private_dir = root / private_dir
    private_dir = private_dir.resolve()
    if private_dir.is_relative_to(root):
        raise ValueError('APP_PRIVATE_DIR must be outside the project folder and its public dist directory')
    return Settings(port, bind, private_dir, model, base_url)


CONFIG = load_config()


if __name__ == '__main__':
    # The launcher consumes exactly the same validation and precedence as the server.
    print(json.dumps({'port': CONFIG.port, 'bind': CONFIG.bind, 'privateDir': str(CONFIG.private_dir),
                      'defaultModel': CONFIG.ollama_default_model, 'ollamaBaseUrl': CONFIG.ollama_base_url}))
