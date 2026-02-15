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
