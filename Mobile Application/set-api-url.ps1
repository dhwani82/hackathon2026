# Run from the "Mobile Application" app folder. Writes .env with your PC's IP so the phone can reach the backend.
$port = 8080
$ip = (Get-NetIPAddress -AddressFamily IPv4 -ErrorAction SilentlyContinue | Where-Object { $_.InterfaceAlias -notmatch 'Loopback|Loopback Pseudo' -and $_.IPAddress -notmatch '^169\.' } | Select-Object -First 1).IPAddress
if (-not $ip) { $ip = '192.168.1.1'; Write-Host "Could not detect IP; using $ip - edit .env if wrong." }
$url = "http://${ip}:${port}"
$line = "EXPO_PUBLIC_API_URL=$url"
Set-Content -Path (Join-Path $PSScriptRoot ".env") -Value $line -Encoding utf8
Write-Host "Wrote .env with: $line"
Write-Host "Restart Expo (press r in the Expo terminal, or stop and run: npm run start)"
