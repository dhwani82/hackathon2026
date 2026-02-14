# Dating App MVP (Expo + React Native)

MVP frontend with auth flow and basic dating UI placeholders. Built with Expo, TypeScript, React Navigation, Axios, and Expo SecureStore.

## Tech stack

- **Expo SDK 54** + **React Native 0.81**
- **TypeScript**
- **React Navigation** (native stack + bottom tabs)
- **Axios** (single instance, Bearer token interceptor)
- **Expo SecureStore** (JWT storage)

## Project structure

```
src/
  app/           # Navigation (AppNavigator, stack + tabs)
  screens/       # Splash, Auth, Discover, Matches, Profile
  services/      # api.ts (Axios), auth.ts, ai.ts
  storage/       # token.ts (SecureStore helper)
  types/         # Shared TypeScript types
  components/    # Input, Button
  data/          # Mock profiles & matches
  config.ts      # BASE_URL (single place)
```

## Setup and run

### 1. Install dependencies

```bash
npm install
```

### 2. Configure API base URL (optional)

Edit `src/config.ts` or set env:

```bash
# .env or export before start
EXPO_PUBLIC_API_URL=https://your-api.com
```

Default is `http://172.20.10.4:8080`. **On a physical device (Expo Go):** use your machine’s LAN IP (e.g. `EXPO_PUBLIC_API_URL=http://192.168.1.100:3000`) so the phone can reach the API.

### 3. Start the app

```bash
npx expo start
```

### 4. Run on iPhone (Expo Go)

1. Install **Expo Go** from the App Store.
2. Ensure phone and dev machine are on the same Wi‑Fi.
3. In the terminal, press **`i`** for iOS simulator, or scan the QR code with your iPhone camera to open in Expo Go.

For a physical device, use the QR code from `npx expo start` and open the project in Expo Go.

## Screens and flow

### Stack (auth)

| Screen            | Behavior |
|-------------------|----------|
| **SplashScreen**  | On start: read token from SecureStore → if exists, `GET /me` → success → MainTabs, else → Login. |
| **RegisterScreen** | name, email, password; validation (name required, valid email, password ≥ 8); `POST /auth/register` → success → Login. |
| **LoginScreen**   | email, password; `POST /auth/login` → store JWT in SecureStore → MainTabs. |
| **ForgotPasswordScreen** | email; `POST /auth/forgot` → success → ResetPassword with email. |
| **ResetPasswordScreen**  | email (prefilled), 6-digit OTP, newPassword; `POST /auth/reset` → success → Login. |

### Main tabs

| Tab           | Screen           | Description |
|---------------|------------------|-------------|
| **Discover**  | DiscoverScreen   | Mock profile cards; Like / Pass (no backend). |
| **Matches**   | MatchesScreen    | Mock matches list. |
| **Profile**   | ProfileScreen    | User from `GET /me` (name, email), Logout (clear token → Login), “Ask Gemini” (input + `POST /ai/gemini`, show response). |

## API usage

- **Config:** `src/config.ts` — `BASE_URL` (env: `EXPO_PUBLIC_API_URL`).
- **Axios:** `src/services/api.ts` — one instance, request interceptor adds `Authorization: Bearer <token>` from SecureStore.
- **Errors:** Response/network errors normalized; use `getApiErrorMessage(err)` for user-facing text.

### Endpoints used

- `POST /auth/register` — `{ name, email, password }`
- `POST /auth/login` — `{ email, password }` → `{ token, user }`
- `POST /auth/forgot` — `{ email }`
- `POST /auth/reset` — `{ email, otp, newPassword }`
- `GET /me` — Bearer token → user
- `POST /ai/gemini` — Bearer token, `{ prompt }` → response text

## Commands summary

```bash
npm install
npx expo start
# Then: press `i` for iOS simulator or scan QR code for Expo Go on iPhone
```

Running in **Expo Go on iPhone** is supported; use the QR code from the terminal or the in-browser dev tools.
