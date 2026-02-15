# Fix "Connection timeout" from phone to backend

## 1. Allow port 8080 through Windows Firewall (do this once)

**Option A – Run the script as Administrator**
1. Open PowerShell **as Administrator** (right‑click → Run as administrator).
2. Run:
   ```powershell
   cd "D:\MSCS\Hackathon\Mobile Application\Backend"
   .\allow-port-8080.ps1
   ```
3. If you get "execution of scripts is disabled", run first:
   ```powershell
   Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
   ```
   Then run `.\allow-port-8080.ps1` again.

**Option B – Add rule manually**
1. Windows Security → Firewall & network protection → Advanced settings.
2. Inbound Rules → New Rule → Port → TCP, 8080 → Allow the connection → Private → Name: "Backend 8080".

---

## 2. Start the backend

```powershell
cd "D:\MSCS\Hackathon\Mobile Application\Backend"
npm run dev
```

Leave this terminal open. You should see:
- `Server running on http://0.0.0.0:8080`
- `On your phone use: http://YOUR_IP:8080`

Use that **YOUR_IP** in the next step if the app still times out.

---

## 3. Match the app to your PC’s IP

- On the **Login screen** the app now shows: **API: http://...**
- The IP in that URL must be your **PC’s IP on the same Wi‑Fi** as your phone.

**If the IP is wrong:**
1. On your PC run: `ipconfig` and find **IPv4 Address** under your Wi‑Fi adapter (e.g. `10.166.136.146` or `192.168.1.x`).
2. In the project open `Mobile Application\src\config.ts` and set:
   ```ts
   BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'http://YOUR_IP_HERE:8080',
   ```
3. Reload the app in Expo (shake device → Reload, or press `r` in the Expo terminal).

---

## 4. Same network

- Phone and PC must be on the **same Wi‑Fi** (not mobile data, not guest Wi‑Fi if it’s isolated).

---

## 5. Quick test from PC

With the backend running, on your PC open a browser and go to:

`http://localhost:8080/me`

You should see JSON (e.g. `{"success":false,"error":"Missing or invalid authorization header"}`). That means the server is running. The phone must use your PC’s **Wi‑Fi IP** instead of `localhost`, e.g. `http://10.166.136.146:8080`.
