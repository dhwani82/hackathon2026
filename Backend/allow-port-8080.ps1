# Run as Administrator to allow backend port 8080 through Windows Firewall
# Right-click PowerShell -> Run as administrator, then: .\allow-port-8080.ps1

$ruleName = "Dating App Backend (Port 8080)"
$port = 8080

# Remove existing rule if present
Remove-NetFirewallRule -DisplayName $ruleName -ErrorAction SilentlyContinue

New-NetFirewallRule -DisplayName $ruleName -Direction Inbound -Protocol TCP -LocalPort $port -Action Allow -Profile Private
Write-Host "Firewall rule added: TCP port $port allowed (Private networks)."
Write-Host "Restart the backend (npm run dev) and try the app again."
