# Cognify

> AI-powered study tool that teaches through hints, not answers.

**Live Demo:** [cognify-phi.vercel.app](https://cognify-phi.vercel.app)

Cognify lets students scan any homework problem and receive step-by-step hints that guide them to the answer rather than just handing it over. The idea is simple: struggle is where learning happens. Hints first, answer last.

---

## What it does

- **Solve** — scan or upload a photo of any problem. Cognify extracts the text via OCR, sends it to GPT, and returns progressive hints. You choose how many hints you need before revealing the answer.
- **Practice** — upload notes or a topic image to generate custom practice problems with configurable subject, difficulty, and quantity.
- **Dashboard** — tracks your solved problems, practice history, hints used, and daily streak. Tap any card to review the full hint progression again.

---

## Tech stack

### Frontend (Web)

- Next.js 14 (App Router)
- TypeScript
- Redux Toolkit + RTK Query
- AWS Amplify (auth client)
- Tailwind CSS + Framer Motion
- Deployed on **Vercel**

### Mobile

- React Native + Expo
- TypeScript
- Redux Toolkit + RTK Query
- amazon-cognito-identity-js (auth client)
- React Navigation

### Backend

- Node.js + Express
- TypeScript
- Supabase (PostgreSQL)
- Deployed on **Render**

### Services

- **AWS Cognito** — user authentication and JWT issuance
- **Google Cloud Vision** — OCR text extraction from images
- **OpenAI GPT** — hint and solution generation

---

## Architecture

```
┌─────────────┐     ┌─────────────────┐     ┌─────────────┐
│  Web Client │────▶│  Express Server │────▶│  Supabase   │
│  (Vercel)   │     │  (Render)       │     │  (Postgres) │
└─────────────┘     └────────┬────────┘     └─────────────┘
                             │
┌─────────────┐              │         ┌──────────────────┐
│   Mobile    │─────────────▶│────────▶│  OpenAI / GCloud │
│   (Expo)    │              │         │  Vision / Cognito│
└─────────────┘              │         └──────────────────┘
                    JWT middleware
                    verifies every
                    request
```

Both clients hit the same backend. Authentication is handled by AWS Cognito — the server verifies the JWT on every protected request and extracts the user identity server-side. The client never sends a `userId` directly.

---

## Security

JWT middleware runs on all `/uploads` routes:

```typescript
// server/src/middleware/verifyToken.ts
const decoded = await verifier.verify(token);
req.userId = decoded.sub; // extracted from verified token, never trusted from client
```

- Tokens are verified against Cognito's public keys on every request
- `userId` is never accepted from the request body or query string
- Expired or tampered tokens are rejected before any handler runs

---

## Running locally

### Prerequisites

- Node.js 18+
- Expo CLI (`npm install -g expo-cli`)
- AWS Cognito user pool
- Supabase project
- OpenAI API key
- Google Cloud Vision API key

### Backend

```bash
cd server
npm install
cp .env.example .env   # fill in your keys
npm run dev            # runs on port 4000
```

### Web

```bash
cd client
npm install
cp .env.example .env.local   # fill in your keys
npm run dev                   # runs on port 3000
```

### Mobile

```bash
cd mobile
npm install
cp .env.example .env   # set EXPO_PUBLIC_API_URL to your local IP
npx expo start
```

> **Note:** For mobile local development, `EXPO_PUBLIC_API_URL` must use your machine's local IP address (e.g. `http://192.168.1.x:4000/api/`), not `localhost`. The device can't reach your computer via `localhost`.

---

## Environment variables

### Backend (`server/.env`)

```
DATABASE_URL=
AWS_COGNITO_USER_POOL_ID=
AWS_REGION=
OPENAI_API_KEY=
GOOGLE_CLOUD_VISION_KEY=
```

### Web (`client/.env.local`)

```
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID=
NEXT_PUBLIC_AWS_COGNITO_USER_POOL_CLIENT_ID=
NEXT_PUBLIC_AWS_REGION=
```

### Mobile (`mobile/.env`)

```
EXPO_PUBLIC_API_URL=
EXPO_PUBLIC_USER_POOL_ID=
EXPO_PUBLIC_USER_POOL_CLIENT_ID=
```

---

## Project structure

```
cognify/
├── client/          # Next.js web app
│   └── src/
│       ├── app/     # App Router pages
│       ├── api/     # RTK Query API slices
│       └── components/
├── mobile/          # React Native + Expo
│   └── src/
│       ├── screens/
│       ├── api/     # RTK Query API slices
│       ├── navigation/
│       └── components/
└── server/          # Express backend
    └── src/
        ├── routes/
        ├── controllers/
        ├── middleware/  # JWT verification
        └── db.ts
```

---

## Key decisions

**Why Cognito instead of rolling auth?**
Cognito handles password hashing, token rotation, account confirmation, and brute force protection out of the box. Building that correctly from scratch would take longer and introduce more risk.

**Why RTK Query instead of plain fetch?**
Automatic caching, loading/error states, and cache invalidation across both clients. Adding a solved problem automatically refetches the dashboard stats without manual coordination.

**Why two separate clients instead of a monorepo?**
React and React Native share logic patterns but not UI primitives. At Cognify's current scale, the duplication is manageable. The natural next step would be extracting shared API types and RTK Query slices into a `packages/shared` directory using Turborepo.

**Why hints instead of direct answers?**
Most AI study tools optimize for getting homework done. Cognify optimizes for actually learning the material — which is what shows up on the exam.

---

## Roadmap

- [ ] Dark mode (toggle already in settings UI)
- [ ] Deploy mobile to TestFlight / Play Store
- [ ] Add tests (unit + integration)
- [ ] Shared types package across web and mobile
- [ ] Offline support with request queuing
- [ ] Push notifications for streak reminders
