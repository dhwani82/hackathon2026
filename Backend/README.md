# Dating App Backend (MVP)

Node.js + Express + TypeScript backend with MongoDB Atlas, JWT auth, and Gemini AI.

## Stack

- Node.js + Express
- TypeScript
- MongoDB Atlas (mongoose)
- bcrypt, JWT, cors, dotenv
- @google/generative-ai (Gemini)

## Setup

### 1. Install dependencies

```bash
cd backend
npm install
```

### 2. Environment

Copy `.env.example` to `.env` and set:

- `MONGODB_URI` – MongoDB Atlas connection string
- `JWT_SECRET` – Secret for signing JWTs (long random string in production)
- `GEMINI_API_KEY` – From [Google AI Studio](https://aistudio.google.com/apikey)
- `EMAIL_SENDING` – Set to `false` to skip sending emails and return OTP in `/auth/forgot` response (for testing)

```bash
cp .env.example .env
# Edit .env with your values
```

### 3. Run

**Development (watch + reload):**

```bash
npm run dev
```

**Production build and run:**

```bash
npm run build
npm start
```

Server listens on `PORT` (default `3000`).

## Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /auth/register | No | `{name, email, password}` → `{user}` |
| POST | /auth/login | No | `{email, password}` → `{token, user}` |
| POST | /auth/forgot | No | `{email}` → `{success}` (or `{otp}` when EMAIL_SENDING=false) |
| POST | /auth/reset | No | `{email, otp, newPassword}` → `{success}` |
| GET | /me | Bearer | → `{user}` |
| POST | /ai/gemini | Bearer | `{prompt}` → `{text}` (rate limit: 20 req / 10 min per IP) |

## Project structure

```
src/
  server.ts       # Entry: connect DB, start server
  app.ts          # Express app, CORS, routes, 404, error handler
  lib/
    db.ts         # MongoDB connect
    gemini.ts     # Gemini API client
  models/
    User.ts       # Mongoose user model
  routes/
    auth.ts       # /auth/* (register, login, forgot, reset)
    ai.ts         # /ai/gemini (protected, rate limited)
  middleware/
    auth.ts       # JWT requireAuth
    error.ts      # Central error handler
  utils/
    otp.ts        # 6-digit OTP generator
```

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start with ts-node-dev (watch) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run compiled `dist/server.js` |
