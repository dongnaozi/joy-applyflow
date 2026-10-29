$ErrorActionPreference = 'Stop'
$stateFile = Join-Path $PSScriptRoot '.runtime\server.json'
if (-not (Test-Path -LiteralPath $stateFile)) { Write-Host '工作台没有已记录的后台服务。'; exit 0 }
try {
    $state = Get-Content -LiteralPath $stateFile -Raw | ConvertFrom-Json
    $siteRoot = Join-Path $PSScriptRoot 'dist'
    if ($state.root -ne $siteRoot -or $state.bind -ne '127.0.0.1' -or [int]$state.port -lt 1 -or [int]$state.port -gt 65535) { throw '服务记录不符，未停止任何程序。' }
    $server = Get-Process -Id ([int]$state.pid) -ErrorAction SilentlyContinue
    if (-not $server) { Write-Host '工作台服务已停止。'; exit 0 }
    $command = Get-CimInstance Win32_Process -Filter ('ProcessId=' + [int]$state.pid)
    $sameStart = $server.StartTime.ToUniversalTime().ToString('o') -eq $state.startedUtc
    $sameCommand = $command.ExecutablePath -eq $state.executable -and $command.CommandLine.Contains('"' + (Join-Path $PSScriptRoot 'server.py') + '"') -and $command.CommandLine.Contains('--port ' + [int]$state.port + ' --bind 127.0.0.1') -and $command.CommandLine.Contains('"' + $siteRoot + '"')
    if (-not ($sameStart -and $sameCommand)) { throw '进程身份与服务记录不符，未停止任何程序。' }
    Stop-Process -Id $server.Id
    Remove-Item -LiteralPath $stateFile
    Write-Host '本机工作台服务已停止。'
} catch {
    Write-Host ('无法停止：' + $_.Exception.Message) -ForegroundColor Red
    exit 1
}
