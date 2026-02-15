# Phone says "Can't connect to server"

Do these **on your PC** in order:

## 1. Start the backend (and leave it running)

Open a terminal and run:

```powershell
cd "d:\MSCS\Hackathon\Mobile Application"
npm run dev
```

You should see something like:
- `Server running on http://0.0.0.0:8080`
- `On your phone use: http://192.168.x.x:8080` (or `10.x.x.x`)

**Note the IP** in that line (e.g. `192.168.1.105`). Leave this terminal open.

---

## 2. Put phone and PC on the same Wi‑Fi

- On your **phone**: connect to the **same Wi‑Fi** as your PC (not mobile data, not guest Wi‑Fi if it’s isolated).
- On your **PC**: make sure Wi‑Fi is connected (the IP from step 1 is your PC’s address on this network).

---

## 3. Point the app at your PC’s IP

The app must use your PC’s current IP. In **PowerShell**, from the **app folder**:

```powershell
cd "d:\MSCS\Hackathon\Mobile Application\Mobile Application"
.\set-api-url.ps1
```

This creates/updates `.env` with `EXPO_PUBLIC_API_URL=http://YOUR_IP:8080`.

If the script doesn’t work, create the file by hand:
1. In the folder `Mobile Application\Mobile Application`, create a file named **`.env`**.
2. Put in one line (use the IP from step 1):

   ```
   EXPO_PUBLIC_API_URL=http://192.168.1.105:8080
   ```
   (Replace `192.168.1.105` with your actual IP.)

---

## 4. Allow port 8080 through Windows Firewall (once)

If the phone still can’t connect, the firewall may be blocking it.

**Option A – Script (run PowerShell as Administrator):**

```powershell
cd "d:\MSCS\Hackathon\Mobile Application\Backend"
.\allow-port-8080.ps1
```

**Option B – Manual:**  
Windows Security → Firewall → Advanced → Inbound rules → New rule → Port → TCP **8080** → Allow.

---

## 5. Restart Expo and reload the app

- In the terminal where **Expo** is running, press **`r`** to reload, or stop (Ctrl+C) and run from repo root:

  ```powershell
  cd "d:\MSCS\Hackathon\Mobile Application"
  npm run start
  ```

- On your phone, reload the app (shake device → Reload, or reopen from Expo Go).

---

## Check what URL the app is using

On the **Login** screen, the app shows: **API: http://...**  
That must be **your PC’s IP** (e.g. `http://192.168.1.105:8080`), not an old or wrong address. If it’s wrong, run step 3 again and restart Expo.
