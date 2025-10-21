# Start backend and frontend in separate PowerShell windows for development
# Usage: .\scripts\start-all.ps1

$root = Split-Path -Parent $MyInvocation.MyCommand.Definition

$backend = Join-Path $root 'backend'
$frontend = Join-Path $root 'frontend'

# Use Set-Location -LiteralPath to correctly handle paths with spaces
Start-Process -FilePath 'powershell.exe' -ArgumentList '-NoExit', "-Command", "Set-Location -LiteralPath '$backend'; npm start" -WindowStyle Normal
Start-Process -FilePath 'powershell.exe' -ArgumentList '-NoExit', "-Command", "Set-Location -LiteralPath '$frontend'; npm run dev" -WindowStyle Normal
Write-Output "Launched backend and frontend in new PowerShell windows."
