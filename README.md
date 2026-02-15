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

See **Frontend/RUN_APP.md** (or **Mobile Application/RUN_APP.md** if not renamed) for how to run the app correctly and avoid duplicate-React issues.

## Frontend pages (working)

**Auth flow (stack)**  
| Screen | File | What it does |
|--------|------|----------------|
| Splash | `SplashScreen.tsx` | Checks auth; sends to Login or main app. |
| Login | `LoginScreen.tsx` | Email/password; demo bypass (dhwani@gmail.com / dhwani08). |
| Register | `RegisterScreen.tsx` | New account (name, email, password). |
| Forgot Password | `ForgotPasswordScreen.tsx` | Request reset by email. |
| Reset Password | `ResetPasswordScreen.tsx` | OTP + new password. |

**Main app (tabs, after login)**  
| Screen | File | What it does |
|--------|------|----------------|
| Feed | `FeedScreen.tsx` | Posts; like, comment, love, repost. |
| Create Post | `CreatePostScreen.tsx` | “What’s on your mind?” + Post. |
| Profile | `ProfileScreen.tsx` | Photo, username, tagline, My Reposts, settings, Log out. |

**Overlay**  
| Component | File | What it does |
|-----------|------|----------------|
| Chatbot | `ChatbotModal.tsx` | Opens from floating chat button; Gemini chat. |

All of the above live in `Mobile Application/src/screens/` (or `Frontend/src/screens/` after rename).

### Make the chatbot run (Gemini)

1. **Get a Gemini API key** – Go to [Google AI Studio](https://aistudio.google.com/app/apikey), sign in, and create an API key.
2. **Add it to the Backend** – In `Backend/.env` set:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```
3. **Restart the Backend** – Stop the backend (Ctrl+C) and run `npm run dev` again from repo root.
4. **App can reach Backend** – Phone and PC on the same Wi‑Fi; app’s `.env` has `EXPO_PUBLIC_API_URL=http://YOUR_PC_IP:8080` (or run `.\set-api-url.ps1` in the app folder and restart Expo).
5. **Use the chat** – Log in, tap the floating chat (owl) button, type a message and send. The reply comes from Gemini.

If the chat shows an error, it will tell you (e.g. “Add GEMINI_API_KEY to Backend .env” or “Can’t connect to server”).

---

### Opening the app on a new phone ("This is taking longer" / app doesn't open)

- **Splash timeout:** If the app waits for the backend and the new phone can't reach it, the splash now gives up after **8 seconds** and sends you to **Login** so the app doesn't hang. You can use demo login (dhwani@gmail.com / dhwani08) to use the app offline.
- **"This is taking longer" (Expo/Metro):** If you see that and the app never loads, the phone is trying to load the JS bundle from your dev machine and can't reach it. **Fix:** 1) Put the **new phone** and the **computer running `npm run start`** on the **same Wi‑Fi**. 2) Or in the Expo terminal press **`s`** to switch to **tunnel** mode and scan the new QR code (works across networks, slower). 3) After the app loads, set the API URL to your PC's IP if you need the backend (see "Make the chatbot run" above).

---

### One-time: remove the duplicate "Mobile Application" folder

If you still see **Mobile Application** twice (root + inner folder), rename the inner one to **Frontend**:

1. **Close Cursor** completely (File → Exit).
2. **Stop Expo** (Ctrl+C in the terminal).
3. Open **File Explorer** → go to `d:\MSCS\Hackathon\Mobile Application`.
4. **Right-click** the inner folder named **Mobile Application** → **Rename** → type **Frontend** → Enter.
5. Reopen Cursor and run `npm run start` from repo root.

After that you’ll have: **Backend**, **Frontend**, and supporting files only. See **RENAME_INSTRUCTIONS.txt** for more detail.
