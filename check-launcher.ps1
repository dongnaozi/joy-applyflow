$ErrorActionPreference = 'Stop'
foreach ($name in @('start-workbench.ps1', 'stop-workbench.ps1', 'scripts/publish.ps1')) {
    $tokens = $null
    $parseErrors = $null
    [Management.Automation.Language.Parser]::ParseFile((Join-Path $PSScriptRoot $name), [ref]$tokens, [ref]$parseErrors) | Out-Null
    if ($parseErrors) { throw ($name + ': ' + ($parseErrors.Message -join '; ')) }
}
Write-Host '启动器 PowerShell 语法检查通过。'
