# Run from repo root (d:\MSCS\Hackathon\Mobile Application).
# Stop Expo (Ctrl+C) and close any editor tabs using the app folder before running.

$root = $PSScriptRoot
$inner = Join-Path $root "Mobile Application"
$frontend = Join-Path $root "Frontend"

if (Test-Path $frontend) {
  Write-Host "Frontend folder already exists. Run: npm run start"
  exit 0
}
if (-not (Test-Path $inner)) {
  Write-Host "Folder 'Mobile Application' not found. Structure may already be updated."
  exit 0
}

try {
  Rename-Item -Path $inner -NewName "Frontend" -ErrorAction Stop
  Write-Host "Renamed 'Mobile Application' to 'Frontend'. Run: npm run start"
} catch {
  Write-Host "Rename failed (folder in use). Stop Expo and close IDE tabs, then run this script again."
  exit 1
}
