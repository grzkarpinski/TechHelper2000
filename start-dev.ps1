$ErrorActionPreference = "Stop"

$root = $PSScriptRoot
if (-not $root) {
    $root = (Get-Location).Path
}

$venvPath = Join-Path $root ".venv"
$activateScript = Join-Path $venvPath "Scripts\Activate.ps1"
$requirementsPath = Join-Path $root "requirements.txt"
$backendMarker = Join-Path $venvPath ".requirements.sha256"
$frontendDir = Join-Path $root "frontend"
$packageJsonPath = Join-Path $frontendDir "package.json"
$packageLockPath = Join-Path $frontendDir "package-lock.json"
$frontendMarker = Join-Path $frontendDir ".deps.sha256"

if (-not (Test-Path $venvPath)) {
    python -m venv $venvPath
}

& $activateScript

$backendHash = (Get-FileHash -Path $requirementsPath -Algorithm SHA256).Hash
$installBackend = $true
if (Test-Path $backendMarker) {
    $savedHash = (Get-Content -Path $backendMarker -Raw).Trim()
    if ($savedHash -eq $backendHash) {
        $installBackend = $false
    }
}

if ($installBackend) {
    python -m pip install --upgrade pip
    python -m pip install -r $requirementsPath
    Set-Content -Path $backendMarker -Value $backendHash
}

$frontendHashTarget = $packageLockPath
if (-not (Test-Path $frontendHashTarget)) {
    $frontendHashTarget = $packageJsonPath
}

$frontendHash = (Get-FileHash -Path $frontendHashTarget -Algorithm SHA256).Hash
$installFrontend = $true
if ((Test-Path $frontendMarker) -and (Test-Path (Join-Path $frontendDir "node_modules"))) {
    $savedHash = (Get-Content -Path $frontendMarker -Raw).Trim()
    if ($savedHash -eq $frontendHash) {
        $installFrontend = $false
    }
}

if ($installFrontend) {
    Push-Location $frontendDir
    npm.cmd install
    Pop-Location
    Set-Content -Path $frontendMarker -Value $frontendHash
}

$backendCmd = "Set-Location '$root'; & '$activateScript'; python -m uvicorn backend.main:app --reload --port 8000"
$frontendCmd = "Set-Location '$frontendDir'; npm.cmd run dev"

Start-Process powershell -ArgumentList "-NoExit", "-ExecutionPolicy", "Bypass", "-Command", $backendCmd
Start-Process powershell -ArgumentList "-NoExit", "-ExecutionPolicy", "Bypass", "-Command", $frontendCmd

$isHealthy = $false
for ($i = 0; $i -lt 15; $i++) {
    Start-Sleep -Seconds 1
    try {
        $response = Invoke-RestMethod -Uri "http://127.0.0.1:8000/health" -TimeoutSec 2
        if ($response.status -eq "ok") {
            $isHealthy = $true
            break
        }
    }
    catch {
    }
}

if ($isHealthy) {
    Write-Host "Backend: http://127.0.0.1:8000"
    Write-Host "Swagger: http://127.0.0.1:8000/docs"
    Write-Host "Frontend: http://127.0.0.1:5173"
}
else {
    Write-Host "Backend nie odpowiedzial na /health w czasie startu. Sprawdz okno backendu."
    Write-Host "Frontend: http://127.0.0.1:5173"
}