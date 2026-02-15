# Run the app

**Always run from this folder** (`Mobile Application`) so the app uses a single React and avoids "Invalid hook call" errors.

## From repo root (easiest)

```bash
cd "d:\MSCS\Hackathon\Mobile Application"
npm run start
```

This switches to this folder and starts Expo with a clear cache.

## From this folder

```bash
cd "d:\MSCS\Hackathon\Mobile Application\Mobile Application"
npm install
npx expo start --clear
```

## Connection timeout when logging in?

1. **Start the backend** (from repo root: `npm run dev`). Leave it running.
2. **Same Wi‑Fi**: Phone and PC must be on the same network (not mobile data).
3. **Set the app’s API URL** to your PC’s IP:
   - In **this folder** run: `.\set-api-url.ps1`  
     (writes `.env` with `EXPO_PUBLIC_API_URL=http://YOUR_IP:8080`)
   - Or copy `.env.example` to `.env` and set `EXPO_PUBLIC_API_URL=http://YOUR_PC_IP:8080` (get the IP from the Backend terminal when you start it).
4. **Restart Expo** (press `r` in the Expo terminal, or stop and `npm run start` again).

See repo **Backend/CONNECTIVITY.md** for firewall and manual steps.

---

## If you still see "Invalid hook call" or "useContext of null"

1. Stop the server (Ctrl+C).
2. In **this folder** run:

```bash
rmdir /s /q node_modules
del package-lock.json
npm install
npx expo start --clear
```

3. In Expo, press `i` (iOS) or `a` (Android).
