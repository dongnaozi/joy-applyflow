$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
if (-not (Get-Command gh -ErrorAction SilentlyContinue)) { throw 'Install the official GitHub CLI (https://cli.github.com), then run gh auth login.' }
Push-Location $projectRoot
try {
    gh auth status --hostname github.com
    if ($LASTEXITCODE -ne 0) { throw 'Run gh auth login first. Never paste a token into this repository.' }
    if (git status --porcelain) { throw 'Commit reviewed changes before publishing.' }
    $owner = gh api user --jq .login
    if ($LASTEXITCODE -ne 0 -or -not $owner) { throw 'Cannot identify the authenticated GitHub account.' }
    $metadata = Get-Content -Raw repository.json | ConvertFrom-Json
    $repository = $owner.Trim() + '/' + $metadata.name
    if (git remote) { throw 'This helper expects a fresh repository without remotes; inspect existing remotes before publishing.' }
    gh repo view $repository --json name 2>$null | Out-Null
    if ($LASTEXITCODE -eq 0) { throw ($repository + ' already exists; inspect it before attaching or pushing this project.') }
    git rev-parse --verify $metadata.release | Out-Null
    if ($LASTEXITCODE -ne 0) { throw 'The release tag is missing.' }
    gh auth setup-git --hostname github.com
    if ($LASTEXITCODE -ne 0) { throw 'Git authentication setup failed.' }
    gh repo create $repository --public --description $metadata.description --source . --remote origin
    if ($LASTEXITCODE -ne 0) { throw 'Repository creation failed; no push was attempted.' }
    git push --set-upstream origin main
    if ($LASTEXITCODE -ne 0) { throw 'Source push failed. The empty GitHub repository may already exist; inspect it before retrying.' }
    git push origin $metadata.release
    if ($LASTEXITCODE -ne 0) { throw 'Tag push failed.' }
    gh repo edit $repository --add-topic ($metadata.topics -join ',')
    if ($LASTEXITCODE -ne 0) { throw 'Source was pushed, but topics could not be updated.' }
    gh release create $metadata.release --repo $repository --title $metadata.releaseName --notes-file CHANGELOG.md
    if ($LASTEXITCODE -ne 0) { throw 'Source was pushed, but release creation failed.' }
    Write-Host ('Published: https://github.com/' + $repository)
} finally { Pop-Location }
