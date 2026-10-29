param([switch]$NoBrowser)
$ErrorActionPreference = 'Stop'
$projectRoot = $PSScriptRoot
$siteRoot = Join-Path $projectRoot 'dist'
$serverScript = Join-Path $projectRoot 'server.py'
$runtimeRoot = Join-Path $projectRoot '.runtime'
$stateFile = Join-Path $runtimeRoot 'server.json'
$appPort = $null
$siteUrl = $null
$marker = 'catalyst-atlas-local-workbench-v2'
$launchMutex = $null
$lockTaken = $false
$server = $null
$stateWasWritten = $false
$recordedServiceRunning = $false

function Test-Workbench {
    try {
        $response = Invoke-WebRequest -UseBasicParsing -Uri ($siteUrl + 'api/health') -TimeoutSec 2
        return $response.StatusCode -eq 200 -and ($response.Content | ConvertFrom-Json).id -eq $marker
    } catch { return $false }
}

function Test-OwnedService {
    try {
        $state = Get-Content -LiteralPath $stateFile -Raw | ConvertFrom-Json
        if ($state.root -ne $siteRoot -or $state.bind -ne '127.0.0.1' -or [int]$state.port -lt 1 -or [int]$state.port -gt 65535) { return $false }
        $server = Get-Process -Id ([int]$state.pid) -ErrorAction Stop
        $command = Get-CimInstance Win32_Process -Filter ('ProcessId=' + [int]$state.pid)
        return $server.StartTime.ToUniversalTime().ToString('o') -eq $state.startedUtc -and $command.ExecutablePath -eq $state.executable -and $command.CommandLine.Contains('"' + $serverScript + '"') -and $command.CommandLine.Contains('--port ' + [int]$state.port + ' --bind 127.0.0.1') -and $command.CommandLine.Contains('"' + $siteRoot + '"')
    } catch { return $false }
}

try {
    if (-not (Test-Path -LiteralPath (Join-Path $siteRoot 'index.html')) -or -not (Test-Path -LiteralPath $serverScript)) {
        throw '找不到 dist\index.html。请保留完整工作台文件夹后再运行。'
    }
    $bundledPython = Join-Path $env:USERPROFILE '.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe'
    $candidates = @($bundledPython)
    foreach ($commandName in @('python.exe', 'python3.exe', 'py.exe')) {
        $command = Get-Command $commandName -CommandType Application -ErrorAction SilentlyContinue
        if ($command -and $command.Source -notlike '*\WindowsApps\*') { $candidates += $command.Source }
    }
    $pythonPath = $null
    foreach ($candidate in ($candidates | Select-Object -Unique)) {
        if (-not (Test-Path -LiteralPath $candidate)) { continue }
        $probeArgs = @('-c', 'import sys; assert sys.version_info >= (3, 10); print(sys.executable)')
        if ([IO.Path]::GetFileName($candidate) -eq 'py.exe') { $probeArgs = @('-3') + $probeArgs }
        try {
            $resolvedPython = & $candidate @probeArgs 2>$null
            if ($LASTEXITCODE -eq 0 -and (Test-Path -LiteralPath ($resolvedPython | Select-Object -Last 1))) {
                $pythonPath = ($resolvedPython | Select-Object -Last 1).Trim()
                break
            }
        } catch { }
    }
    if (-not $pythonPath) { throw '未找到 Python 3.10 或更新版本。请安装 python.org 的免费 Python 3，再双击启动。' }
    $configJson = & $pythonPath (Join-Path $projectRoot 'config.py')
    if ($LASTEXITCODE -ne 0) { throw '.env 或环境变量配置无效，请查看上方配置错误。' }
    $settings = $configJson | ConvertFrom-Json
    $appPort = [int]$settings.port
    $siteUrl = 'http://127.0.0.1:' + $appPort + '/'
    $logsRoot = Join-Path $settings.privateDir 'logs'
    # One lock per checkout prevents changed ports from overwriting a live service record.
    $hasher = [Security.Cryptography.SHA256]::Create()
    try { $rootId = [BitConverter]::ToString($hasher.ComputeHash([Text.Encoding]::UTF8.GetBytes($projectRoot))).Replace('-', '').Substring(0, 16) } finally { $hasher.Dispose() }
    $launchMutex = New-Object Threading.Mutex($false, ('Local\JoyApplyFlow' + $rootId))
    try { $lockTaken = $launchMutex.WaitOne(10000) } catch [Threading.AbandonedMutexException] { $lockTaken = $true }
    if (-not $lockTaken) { throw '另一个启动程序还在运行，请稍候重试。' }
    if (Test-Path -LiteralPath $stateFile) {
        $recorded = Get-Content -LiteralPath $stateFile -Raw | ConvertFrom-Json
        if (Get-Process -Id ([int]$recorded.pid) -ErrorAction SilentlyContinue) {
            if (-not (Test-OwnedService)) { throw '已记录的进程身份不符，未处理该程序。' }
            if ([int]$recorded.port -ne $appPort) { throw '端口配置已改变。请先运行停止工作台，再重新启动。' }
            $recordedServiceRunning = $true
        }
    }
    if (Test-Workbench) {
        if (-not (Test-OwnedService)) { throw ('端口 ' + $appPort + ' 上的工作台不属于本文件夹的已记录服务，未处理该程序。') }
    } else {
        if ($recordedServiceRunning) { throw '已记录的服务尚在运行但没有响应，请先运行停止工作台。' }
        $probe = New-Object Net.Sockets.TcpClient
        try {
            $connected = $probe.ConnectAsync('127.0.0.1', $appPort).Wait(500)
            if ($connected -and $probe.Connected) { throw ('端口 ' + $appPort + ' 已被其他程序占用。请先关闭该程序，不能打开未确认的站点。') }
        } catch [System.AggregateException] { } finally { $probe.Dispose() }

        New-Item -ItemType Directory -Path $runtimeRoot -Force | Out-Null
        New-Item -ItemType Directory -Path $logsRoot -Force | Out-Null
        [IO.File]::WriteAllText((Join-Path $siteRoot 'workbench-id.txt'), $marker, [Text.Encoding]::ASCII)
        $serverArgs = '"' + $serverScript + '" --port ' + $appPort + ' --bind 127.0.0.1 --directory "' + $siteRoot + '"'
        $server = Start-Process -FilePath $pythonPath -ArgumentList $serverArgs -WorkingDirectory $projectRoot -WindowStyle Hidden -PassThru -RedirectStandardOutput (Join-Path $logsRoot 'server.log') -RedirectStandardError (Join-Path $logsRoot 'server-error.log')
        @{ pid = $server.Id; startedUtc = $server.StartTime.ToUniversalTime().ToString('o'); root = $siteRoot; executable = $pythonPath; port = $appPort; bind = '127.0.0.1' } | ConvertTo-Json | Set-Content -LiteralPath $stateFile -Encoding UTF8
        $stateWasWritten = $true
        $ready = $false
        for ($attempt = 0; $attempt -lt 20; $attempt++) {
            if (Test-Workbench) { $ready = $true; break }
            if ($server.HasExited) { break }
            Start-Sleep -Milliseconds 250
        }
        if (-not $ready) { throw ('工作台启动失败。请查看 ' + (Join-Path $logsRoot 'server-error.log')) }
    }
    Write-Host ('工作台已就绪：' + $siteUrl) -ForegroundColor Green
    if (-not $NoBrowser) { Start-Process $siteUrl }
    exit 0
} catch {
    if ($server) {
        if (-not $server.HasExited) { Stop-Process -InputObject $server -ErrorAction SilentlyContinue }
        if ($stateWasWritten) { Remove-Item -LiteralPath $stateFile -ErrorAction SilentlyContinue }
    }
    Write-Host ('无法启动：' + $_.Exception.Message) -ForegroundColor Red
    exit 1
} finally {
    if ($lockTaken) { $launchMutex.ReleaseMutex() }
    if ($launchMutex) { $launchMutex.Dispose() }
}
