# Hackathon 2026 – Dating / Style Tips App

## Repository structure

```
Mobile Application/              ← repo root (you are here)
├── Backend/                     ← Node/Express API (auth, AI, etc.)
├── Frontend/                    ← Expo app (screens, feed, profile – all in src/)
├── package.json                 ← root scripts: start app, run backend
├── App.tsx                      ← minimal root entry (do not run Expo from here)
└── README.md                    ← this file
```

- **Backend** = API only. Run with `npm run dev` from root.
- **Frontend** = the Expo app. Run with `npm run start` from root.

## Commands (from repo root)

| Command | What it does |
|--------|----------------|
| `npm run start` | Start the Expo app |
| `npm run dev` | Start the Backend API |
| `npm run ios` | Start Expo for iOS |
| `npm run android` | Start Expo for Android |

See **Frontend/RUN_APP.md** for how to run the app correctly and avoid duplicate-React issues.

### One-time: remove the duplicate "Mobile Application" folder

If you still see **Mobile Application** twice (root + inner folder), rename the inner one to **Frontend**:

1. **Close Cursor** completely (File → Exit).
2. **Stop Expo** (Ctrl+C in the terminal).
3. Open **File Explorer** → go to `d:\MSCS\Hackathon\Mobile Application`.
4. **Right-click** the inner folder named **Mobile Application** → **Rename** → type **Frontend** → Enter.
5. Reopen Cursor and run `npm run start` from repo root.

After that you’ll have: **Backend**, **Frontend**, and supporting files only. See **RENAME_INSTRUCTIONS.txt** for more detail.
