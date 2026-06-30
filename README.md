# Personal Assistant

A local-first mobile organizer for iPhone and Android. No cloud, no subscription — your data stays on your device.

## Features

### Personal OS (built for Kai)
- **My OS** — mission, values, long-term goals, decision filter, reminders
- **Primary project** — one focus on Today; everything else is backlog
- **Evening reflection** — 6 daily questions (faith, service, growth, gratitude)
- **Weekly review** — life balance check-in (10 areas), review, clear inbox, plan week
- **Decision filter** — required walkthrough before major initiatives
- **Default habits** — Morning devotion, Bible study, Move my body (on first launch)

### Organizer
- **Today** — overdue, today's tasks, habits, and "This Evening" section
- **Inbox** — quick capture, organize later
- **Tasks** — filter by All, Today, Upcoming, Done
- **Habits** — daily check-ins with 7-day streak dots
- **Weekly review** — review last week, clear inbox, plan the week
- **Reminders** — local push notifications for tasks with due dates
- **Backup** — export/import JSON to Files or iCloud Drive
- **Theme** — System, Light, or Dark

## Requirements

- [Node.js](https://nodejs.org/) 18+
- [Expo Go](https://expo.dev/go) on your iPhone (for quick testing)
- Same Wi‑Fi network as your computer when using Expo Go

## Quick start (iPhone with Expo Go)

1. Open a terminal in this folder:

   ```bash
   cd personal-assistant
   npm start
   ```

2. Scan the QR code with your iPhone camera (or the Expo Go app).

3. Allow notifications when prompted (for task reminders).

## Web (browser)

Run locally:

```bash
cd personal-assistant
npm run web
```

Build a static export:

```bash
npm run build:web
```

Output goes to `dist/`. Web uses SQLite in the browser (data stays in your browser storage, not on a server).

## GitHub Pages deploy

A workflow at `.github/workflows/deploy-pages.yml` builds and deploys on push to `main`/`master`.

1. Push this folder to GitHub.
2. In the repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. After the workflow runs, open `https://<username>.github.io/<repo-name>/`.

The first load may refresh once so the service worker can enable SQLite (required COOP/COEP headers on static hosts).

For a user site at `https://<username>.github.io/` (no repo subpath), set `EXPO_BASE_URL` to empty in the workflow.

## Install on your iPhone (standalone app)

For full notification support and offline use without Expo Go:

```bash
cd personal-assistant
npx expo install expo-dev-client
npx eas build --profile development --platform ios
```

You need a free [Expo account](https://expo.dev/signup) and an [Apple Developer](https://developer.apple.com/) account ($99/year) to install on your own iPhone via TestFlight or direct install.

For Android:

```bash
npx eas build --profile development --platform android
```

## Project structure

```
app/           Screens (expo-router)
components/    UI components
contexts/      Theme + app data
db/            SQLite repositories
lib/           Theme, dates, notifications, backup
```

## Data & privacy

All tasks, habits, and settings are stored in SQLite on your device. Nothing is sent to a server. Use **More → Export backup** to save a copy to iCloud Drive or Google Drive.

## Tech stack

- Expo SDK 56 + React Native
- expo-sqlite (local database)
- expo-notifications (local reminders)
- expo-router (navigation)
