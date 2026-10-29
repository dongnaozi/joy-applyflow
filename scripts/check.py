"""Offline release checks; Python 3.10+ and Node 22+, no package installation."""
import subprocess
import sys
from pathlib import Path

root = Path(__file__).resolve().parents[1]
checks = [(sys.executable, name) for name in ('check-config.py', 'check-literature.py', 'check-mentor-import.py', 'check-ollama.py', 'check-release.py')]
checks += [('node', name) for name in ('check-local.mjs', 'check-profile.mjs', 'check-research.mjs', 'check-research-view.mjs', 'check-application.mjs', 'check-literature.mjs')]
for command in checks:
    subprocess.run(command, cwd=root, check=True)
print('All offline release checks passed.')
