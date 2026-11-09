# Settle in Germany

One Expo (React Native) codebase that ships the **website**, the **Android app** and the **iOS app**, each matching its own designs from the "Calm Ledger" canvas.

- Product brief: [`docs/brief.pdf`](docs/brief.pdf)
- Build handoff (source of truth for this implementation): [`docs/HANDOFF.md`](docs/HANDOFF.md)
- Every design frame: [`design/design-source/`](design/design-source) (`ios-*`, `and-*`, `web-*` frames + shared components; `canvas.json` is the index)
- **Content management: [`docs/CMS.md`](docs/CMS.md)** — one Supabase database + the CMS in `cms/`; publishing updates iOS, Android and the web at once

## Run it

```bash
npm install
npx expo start            # press i / a / w for iOS, Android, web
```

Ads, the document scanner, IAP and Sign in with Apple are native modules, so use a **development build** (not Expo Go):

```bash
npx eas-cli@latest build --profile development -p all
```

| Script | What it does |
|---|---|
| `npm run dev` | Dev server (`expo start`) |
| `npm run build:native` | EAS Build, iOS + Android |
| `npm run submit` | EAS Submit, both stores |
| `npm run build:web` | Static website → `dist/` (deploy to any static host) |
| `npm run release` | All three |
| `npm run typecheck` / `npm run lint` / `npm test` | TypeScript, ESLint, Jest |
| `npm run cms:dev` / `npm run cms:build` | Content management app (`cms/`, run `npm --prefix cms install` first) |
| `npm run db:test` | Database schema + publish workflow tests on a throwaway local PostgreSQL |
| `npm run content:snapshot` | Bake the latest published content into the build (runs automatically in `build:web` and EAS builds) |
| `npm run db:seed-sql` | Regenerate `supabase/seed.sql` (new database) and `supabase/seed-update.sql` (bring an existing database up to date) from `src/content/seed.ts` |

Copy `.env.example` to `.env.local` to connect the content database (Supabase), the AI backend, RevenueCat and the ad units. **With no env at all the app still runs**: it uses the bundled seed content, AI demo responses (bracketed placeholders) and fixed-size ad placeholders, and the CMS runs in demo mode.

## Architecture

```
app/                  Expo Router routes (thin: metadata + one screen component)
  (tabs)/             Home · Guides · Assist · Tools · Me
  onboarding/[step]   9 skippable steps
  guides/[slug]       Static, crawlable guide pages (generateStaticParams + generateMetadata)
  …                   every route in HANDOFF Appendix A
  dev/gallery         Component gallery (dev only) — light and dark side by side
cms/                  Content management web app (Vite + React) — see docs/CMS.md
supabase/             Database migration, seed, Edge Functions (publish webhook, editor invites), tests
src/
  theme/              Tokens (HANDOFF §5, copied exactly), ThemeProvider (system + manual override)
  ui/                 Component kit (HANDOFF §6). Platform shape differences via theme.shape / platform files
  features/           Screens, grouped by area (onboarding, home, roadmap, guides, reminders, assist, tools, me, info, premium, consent)
  content/            Content types (§8), collections, seed, database client, Realtime sync (sync.ts)
  store/              Local-first state (profile, consent, roadmap, reminders) in expo-sqlite kv-store (localStorage on web)
  services/           ads, consent, purchases (RevenueCat), notifications, auth (Supabase), api + ai (backend only), scanner
  i18n/               i18next: en, ne, hi
```

### How each platform gets its own design

- **Tokens are shared, shapes are not.** `useTheme().shape` gives per-platform radii (iOS buttons 12 / cards 16 / pill chips; Android pill buttons / cards 20 / radius-8 chips; web 12 / 16).
- `AppBar` renders the iOS large title + "‹ Back" or the Android 64 px bar with ←; `StageSwitcher` is a segmented control on iOS/web and underlined tabs on Android; `TabBar` has the Material 3 pill on Android; sheets put Cancel/Save in the header on iOS and actions at the bottom on Android; the Android reminders screen uses an extended FAB.
- **Web** wraps every screen in `WebShell` (site header, breadcrumbs, 760 px reading column, side column, footer). Under 600 px it uses the mobile header plus the iOS-style tab bar; at 1024 px and up it shows the desktop layout and a provider table on comparison pages.
- `Screen` (`src/ui/Screen.tsx`) picks the right chrome, so feature screens are written once.
- Dark mode follows the system on iOS/Android with a manual override in **Me › Appearance**. **Web is light-only** for now (`WEB_DARK_ENABLED` in `ThemeProvider`).

### Rules the code enforces

- **Nothing factual is hard-coded.** Guides, tasks, cities, rules, providers, phrases and help services come from the central content database (`published_content`), with a build-time snapshot and the seed as fallbacks. The seed (`src/content/data/`) holds the Leipzig content in English, Nepali and Hindi; every page lists its official sources.
- **Status = colour + icon + word** (`DeadlineChip`, `Callout`, risk levels). Saffron is only used as a fill, never for text.
- **Ads**: free tier only, nothing renders before a consent decision, fixed heights (no layout shift), labelled "Ad", placed only where §7.6 allows (never on AI, paywall, onboarding, emergency or document-date screens).
- **Consent** before any personalised ads or analytics. "Accept all", "Reject all" and "Settings" have equal weight. You can change it in Me › Privacy and in the web footer's "Cookie settings".
- **AI** goes through `services/api.ts` → our backend. The client never holds model keys. The 3 free scans are shown *before* a scan. After the last free scan the result still shows in full, followed by a soft upgrade card. Urgent letters get a red banner that can't be dismissed.
- **Reminders** store dates and notes only, never document images. They default to 90/30/7 days before.
- **Offline**: roadmap, reminders and opened guides (persisted query cache) work offline; a subtle banner shows instead of an error, and AI screens say "Needs internet".
- **Monetisation** never blocks free information. The paywall shows the price after the trial and how to cancel, with restore, terms/privacy and a visible close. It has no timers.

## Status

| Build order (HANDOFF §10) | State |
|---|---|
| 1. Scaffold, tokens, fonts, i18n, theme, `/dev/gallery` | ✅ |
| 2. Navigation shells (iOS/Android tab bars, web header + mobile-web tabs) | ✅ |
| 3. Onboarding → Home → Roadmap → Guides → Guide (static SEO) → Reminders (+ local notifications) | ✅ |
| 4. Tools: comparisons, calculators, phrasebook, safety, city page, rule-change alerts | ✅ with 2026 rates from official sources |
| 5. Me, privacy, subscription, how we make money, where to get help, consent | ✅ |
| 6. Assist: hub, scan/upload, processing, letter result (+ urgent, last-free), reply writer, chat, scam, contract, forms, job kit, practice | ✅ UI + backend client. The backend itself isn't built yet. Forms, job kit and practice still use sample content. |
| 7. Payments (RevenueCat) and ads (AdMob/AdSense) with consent gating | ✅ wired, needs keys and unit IDs |
| 8. States: empty, skeleton, error, offline, outdated, limit reached | ✅ |
| 9. Release pipelines | `eas.json` + scripts. Run `eas init` to create the project ID |

Verified locally: `tsc` clean, ESLint clean, Jest passing, `expo export -p web` (79 static routes with title/description/canonical), `expo export -p ios -p android` (Hermes bundles), and Playwright screenshots of the main web pages at 390 px and 1440 px with no hydration errors.

## Open items for the product owner (HANDOFF §12)

Search for `TODO(product owner)` in the code. In short:

- Review the Leipzig content (checked against official sources on 5 Nov 2026) and add other cities in the CMS. Coracle's fees come from its 2023 terms; no community places (shops, temples, groups) are listed yet because none could be verified.
- Turn on email, Google and Apple sign-in in Supabase (see “User accounts” in [`docs/CMS.md`](docs/CMS.md)).
- Create the Supabase project and web host, then follow [`docs/CMS.md`](docs/CMS.md).
- The backend for the AI endpoints in `src/services/ai.ts` and for push registration.
- Official App Store / Google Play badge artwork.
- Native-speaker review of the Nepali and Hindi copy and transliterations (`src/i18n/locales/ne.ts`, `hi.ts`, `src/content/data/`).
- The final ad partner list and unit IDs (`app.json` still uses the AdMob **test** app IDs).
- A certified IAB TCF CMP on web, styled like `WebConsent.dc.html`.
- Stage and empty-state illustrations.
- Web dark mode, which isn't designed yet.
- The operator's details in the Impressum, and a legal review of the draft privacy policy and terms (`src/features/info/legal.ts`).
