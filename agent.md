# MoneyFy Frontend Agent Notes

**Project**
- Expo Router + React Native app.
- Entry point is `expo-router/entry` via `package.json`.
- Target Node.js >= 20.19.4 and npm.

**Setup**
- Install deps: `npm install`.
- Create env file: `copy .env.example .env`.
- Required env vars:
  - `API_URL` (base URL for backend, e.g. `https://api.moneyfy.cl`)
  - `NODE_ENV` (`development` or `production`)

**Run**
- Dev server: `npx expo start`
- Clear cache after env changes: `npx expo start --clear`
- Android: `npm run android`
- iOS: `npm run ios`
- Web: `npm run web`

**Quality**
- Lint: `npm run lint`
- Tests: `npm run test`

**Code Conventions**
- Prefer `@/` path aliases.
- Avoid barrel imports (e.g. `shared/components`, `shared/hooks`, `core/context`) to prevent require cycles. Import from the concrete file instead.
- Keep side effects in providers/services; UI components should be presentational.

**Networking**
- Axios config lives in `core/services/api/config.ts`.
- Interceptors are registered in `core/services/api/interceptors`.
- Base URL is read from `config.ts`, which consumes `app.config.js` extras.

**Troubleshooting**
- If screens are stuck on loader, verify `AuthProvider` is not initializing `isLoading` as `true`.
- For API issues, confirm `API_URL` and restart Metro with `--clear`.

**Cleanup After Debugging**
- Remove temporary `console.*` logs and debug alerts added during troubleshooting before final commits.
