# Hackathon 2026 – Dating / Style Tips App

## Repository structure

```
Mobile Application/              ← repo root (you are here)
├── Backend/                     ← Node/Express API (auth, AI, etc.)
├── Mobile Application/         ← Expo app (screens, feed, profile – all in src/)
├── package.json                 ← root scripts: start app, run backend
├── App.tsx                      ← minimal root entry (do not run Expo from here)
└── README.md                    ← this file
```

- **Backend** = API only. Run with `npm run dev` from root.
- **Mobile Application** (the inner folder) = the Expo app. Run with `npm run start` from root.

## Commands (from repo root)

| Command | What it does |
|--------|----------------|
| `npm run start` | Start the Expo app |
| `npm run dev` | Start the Backend API |
| `npm run ios` | Start Expo for iOS |
| `npm run android` | Start Expo for Android |

See **Mobile Application/RUN_APP.md** for how to run the app correctly and avoid duplicate-React issues.

### If you see two app folders (e.g. "Mobile Application" and "frontend")

They point to the same files. To remove the duplicate **frontend** entry: stop Expo (Ctrl+C), then in PowerShell from repo root run `Remove-Item frontend -Force`. Use only the **Mobile Application** (inner) folder; scripts already use it.
