"""Offline configuration and launcher/server contract checks: python check-config.py."""
import json
import os
import subprocess
import sys
import unittest
from pathlib import Path
from tempfile import TemporaryDirectory
from unittest.mock import patch

import config


class ConfigCheck(unittest.TestCase):
    def test_literal_env_precedence_and_local_private_boundaries(self):
        runtime_root = config.ROOT / '.runtime'
        runtime_root.mkdir(exist_ok=True)
        with TemporaryDirectory(dir=runtime_root, prefix='config-check-') as folder:
            base = Path(folder)
            self.assertTrue(base.resolve().is_relative_to(runtime_root.resolve()))
            root = base / 'release'
            root.mkdir()
            private = base / 'my private data'
            dotenv = root / '.env'
            dotenv.write_text(f'''# local values
APP_PORT=9218 # comment
APP_BIND="127.0.0.1"
APP_PRIVATE_DIR='{private}'
OLLAMA_DEFAULT_MODEL=deepseek-r1:7b
OLLAMA_BASE_URL=http://127.0.0.1:11434/v1/
LITERAL=$(never-execute)${{APP_PORT}}
''', encoding='utf-8')
            values = config.read_dotenv(dotenv)
            self.assertEqual(values['LITERAL'], '$(never-execute)${APP_PORT}')
            settings = config.load_config(root=root, environ={})
            self.assertEqual(settings.port, 9218)
            self.assertEqual(settings.ollama_default_model, 'deepseek-r1:7b')
            self.assertEqual(settings.ollama_base_url, 'http://127.0.0.1:11434/v1')
            self.assertEqual(settings.literature_cache, private / 'cache' / 'literature-cache.json')
            self.assertFalse(private.exists(), 'configuration reads must not create private files')
            override = config.load_config(root=root, environ={'APP_PORT': '9219'})
            self.assertEqual(override.port, 9219)
            self.assertEqual(override.ollama_default_model, 'deepseek-r1:7b')
            invalid = {
                'APP_PORT': ('0', '-1', '65536', '1.2', '', '8792;echo no'),
                'APP_BIND': ('0.0.0.0', 'localhost', '::1'),
                'APP_PRIVATE_DIR': (str(root), str(root / 'dist' / 'private'), '.runtime'),
                'OLLAMA_DEFAULT_MODEL': ('cloud-model', ''),
                'OLLAMA_BASE_URL': ('https://localhost:11434/v1', 'http://localhost:11435/v1',
                                    'http://127.0.0.2:11434/v1', 'http://example.com:11434/v1',
                                    'http://localhost:11434/v1?redirect=elsewhere',
                                    'http://localhost:11434/v1@evil.test'),
            }
            for key, attempts in invalid.items():
                for value in attempts:
                    with self.subTest(key=key, value=value), self.assertRaises(ValueError):
                        config.load_config(root=root, environ={key: value})
            for bad in ('APP_PORT', 'APP_PORT="unterminated', 'export APP_PORT=9000'):
                dotenv.write_text(bad, encoding='utf-8')
                with self.assertRaises(ValueError):
                    config.read_dotenv(dotenv)
            dotenv.unlink()
            self.assertEqual(config.load_config(root=root, environ={'APPDATA': str(base)}, platform='win32').private_dir,
                             base / 'joy-applyflow' / 'private')
            self.assertEqual(config.load_config(root=root, environ={'XDG_STATE_HOME': str(base)}, platform='linux').private_dir,
                             base / 'joy-applyflow' / 'private')
            # Exercise the exact JSON contract consumed by start-workbench.ps1.
            (root / 'config.py').write_text(Path(config.__file__).read_text(encoding='utf-8'), encoding='utf-8')
            dotenv.write_text('APP_PORT=9220\nAPP_PRIVATE_DIR="' + str(private) + '"\n', encoding='utf-8')
            launcher = json.loads(subprocess.check_output([sys.executable, str(root / 'config.py')],
                                 env={key: value for key, value in os.environ.items()
                                      if key not in {'APP_PORT', 'APP_BIND', 'APP_PRIVATE_DIR', 'OLLAMA_DEFAULT_MODEL', 'OLLAMA_BASE_URL'}},
                                 text=True))
            self.assertEqual(launcher['port'], 9220)
            self.assertEqual(launcher['privateDir'], str(private))
            # CLI --port must override configuration without widening the bind address.
            import server
            with patch.object(server, 'CONFIG', settings), patch.object(sys, 'argv', ['server.py', '--port', '9221']), \
                    patch.object(server, 'ThreadingHTTPServer') as http_server:
                server.main()
                self.assertEqual(http_server.call_args.args[0], ('127.0.0.1', 9221))
                self.assertEqual(server.Handler.literature.cache_path, settings.literature_cache)


if __name__ == '__main__':
    unittest.main()
