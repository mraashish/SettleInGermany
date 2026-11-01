# Settle in Germany — build handoff for Claude Code

You are building **one codebase** that ships three products at once: a **website**, an **Android app** and an **iOS app**. Each platform must match **its own** designs from the Claude Design canvas. This file tells you what to build, with which stack, where every design lives, and the rules you must not break.

Read this whole file before writing code. Then read `docs/brief.pdf` (the product brief) once.

---

## 1. What is in this package

```
HANDOFF.md                 ← this file
docs/brief.pdf             ← original product brief (source of truth for product rules)
design-source/             ← every design frame from the canvas, as .dc.html files
  canvas.json              ← index: every frame, its page (ios / android / web / …), size and title
  ios-*.dc.html            ← iOS frames        (canvas page "iOS")
  and-*.dc.html            ← Android frames    (canvas page "Android")
  web-*.dc.html            ← Web frames        (canvas page "Web")
  <PascalCase>.dc.html     ← the shared design components the frames are built from
  Foundations.dc.html      ← colour, type, icons
  Library.dc.html          ← component library with all variants and states
```

The live canvas (private to the owner): https://claude.ai/artifact/GYDLrwPZQpD9k5fBGN5YYi — you will not be able to open it; `design-source/` is the same content.

### How to read a design file
- Each `*.dc.html` is HTML with **inline styles**. Treat the inline styles as the spec: exact colours, sizes, spacing, radii, font weights.
- Frame files (`ios-…`, `and-…`, `web-…`) are thin wrappers. They contain one `<dc-import name="Component" platform="…" dark="…" …>` line. Open the named `Component.dc.html` to see the real layout.
- Components switch with props: `platform` = `ios | android | web`, `dark` = `true | false`, plus a screen selector (`step`, `tool`, `screen`, `topic`, `state`, `size`).
- `{{ name }}` holes are filled in the `<script type="text/x-dc">` block at the bottom (`renderVals()`). The `k` object there is the **light/dark colour table** — it maps every light hex to its dark hex.
- `<sc-if>` = conditional, `<sc-for>` = list. Bracketed text like `[€ —]`, `[date]`, `[Provider A]` is a **placeholder**: the real value comes from the content system (see §8), never hard-code it.
- Ignore `B-*`, `C-*`, `Main.dc.html`, `A-*.dc.html` (early explorations) unless asked.

Appendix A maps every screen to its route and to its exact frame on each platform.

---

## 2. Stack (decided)

**Expo (React Native) + Expo Router + TypeScript**, one repo, one IDE (VS Code or Cursor).

Why this and not Flutter: the website is also the SEO landing site (public guide pages from Google). Expo Router can **statically render web pages** (`web.output: "static"`), so guides are crawlable HTML. Flutter web renders to canvas and is weak for SEO. React Native also gives first-class native controls on iOS and Android.

| Need | Use |
|---|---|
| Language | TypeScript (strict) |
| Framework | Expo (latest stable SDK), React Native, React Native Web |
| Routing | Expo Router (file-based, shared across all three) |
| Styling | `StyleSheet` + a typed theme object (tokens in §5). No CSS frameworks |
| Icons | `lucide-react-native` (2 px outline) — same set the designs use |
| Fonts | `expo-font`: Inter (400/500/600/700) + Noto Sans Devanagari (400/500/600/700) |
| i18n | `i18next` + `react-i18next`; locales `en`, `ne`, `hi` |
| Data / offline | TanStack Query + persisted cache; `expo-sqlite` for roadmap, reminders, saved guides |
| Notifications | `expo-notifications` (local scheduled reminders; push for rule changes) |
| Document scan | iOS VisionKit / Android ML Kit document scanner via a config-plugin library (e.g. `react-native-document-scanner-plugin`); web: file input |
| Auth | Sign in with Apple, Google, email (e.g. Supabase Auth); "continue without account" stores locally |
| Payments | RevenueCat for entitlements across all three: App Store IAP, Google Play Billing, and RevenueCat Web Billing (Stripe) on web |
| Ads | `react-native-google-mobile-ads` (AdMob) on apps; AdSense on web |
| Consent | Google UMP on apps (via the AdMob library); a certified CMP on web (IAB TCF) styled like `WebConsent.dc.html` |
| Content | Headless CMS for guides, cities, rules, providers, phrasebook (fields in §8) |
| AI | Your own backend endpoints only — never call a model from the client (§7.4) |
| Build / release | EAS Build + EAS Submit (iOS, Android); `npx expo export -p web` → static hosting |

Use a **development build** (not Expo Go) — ads, scanner and IAP need native modules.

### One-command workflow
```bash
npx expo start            # press i / a / w for iOS, Android, web
eas build -p all          # iOS + Android store builds
eas submit -p all
npx expo export -p web    # static site → deploy dist/
```
Add these as `package.json` scripts (`dev`, `build:native`, `submit`, `build:web`, `release` = all three).

---

## 3. How each platform gets its own design

Do **not** make one generic UI. The three canvas pages are different on purpose.

1. **Shared logic, platform views.** Screens live in `app/` (routes). Visual components live in `src/ui/`. When a component looks different per platform, split it with platform files: `Button.ios.tsx`, `Button.android.tsx`, `Button.web.tsx` (Expo picks the right one). Small differences use `Platform.select`.
2. **Tokens are shared**, shapes are not (see table).
3. **Web has two layouts**: mobile web (< 600 px) is the app layout with a bottom tab bar; desktop (≥ 1024 px) has a top nav, a content column (max ≈ 720 px for reading) and a right side column. Use `useWindowDimensions`. 600–1023 px: two columns where useful.

| | iOS (`ios-*`) | Android (`and-*`) | Web (`web-*`) |
|---|---|---|---|
| Header | Large title, "‹ Back" text link (`AppBar` ios) | 64 px top app bar, ← arrow, 22 px title (`AppBar` android) | Site header (logo, Home · Guides · Assist · Tools, language, account) + breadcrumbs (`WebShell`) |
| Tab bar | 84 px, icons + labels, no pill | 80 px, Material 3 active pill | Mobile web: iOS-style tab bar; desktop: none |
| Assist tab | Raised saffron circle in the centre on all platforms | same | Top-nav item on desktop |
| Buttons | Radius 12–14 | Fully rounded (999) | Radius 12 |
| Cards | Radius 16 | Radius 20 | Radius 16–20 |
| Chips | Pills (999) | Radius 8 | Pills |
| Text fields | Radius 12 | Radius 4 (outlined) | Radius 10–12 |
| Stage switcher | Segmented control | Underlined tabs | Segmented control |
| Sheets | Sheets with detents, Cancel/Save in header | Bottom sheet, actions at bottom | Modal or side panel |
| Add reminder | "+" in nav bar | Extended FAB "Add reminder" | Button |
| Paywall | Sheet with grabber + close | Full-screen dialog with ✕ | Centred dialog (desktop), full page (mobile) |
| Scanner | VisionKit capture screen | ML Kit capture screen | Upload drop zone + "take a photo" (`LetterFlow step=upload`) |
| Purchase | App Store | Google Play | Stripe (via RevenueCat Web Billing) |

Dark mode: required on iOS and Android, following the system setting with a manual override in Me › Appearance. **Web dark mode is not designed yet — ship web light-only for now** but keep the theme switch in code.

---

## 4. Visual direction — "Calm Ledger"

Calm, official-grade, never salesy. Warm grey ground, deep teal for action, saffron only for highlights, Premium and celebrations. Status is **always colour + icon + word**, never colour alone.

---

## 5. Design tokens (copy exactly)

### Colour
| Token | Light | Dark | Use |
|---|---|---|---|
| ground | `#F6F4F0` | `#121614` | Screen background |
| surface | `#FFFFFF` | `#1A2221` | Cards, sheets |
| border | `#E4E0D8` | `#2C3634` | Card borders |
| divider | `#EFECE6` | `#252D2C` | Row dividers, neutral chip bg |
| borderStrong | `#CFC9BE` | `#4A5755` | Chips, dashed slots |
| fieldBorder | `#A8A196` | `#6F7B79` | Inputs, unchecked boxes |
| text | `#1F1D1A` | `#ECEAE5` | Primary text |
| text2 | `#3B3833` | `#C9CFCD` | Body on surface |
| text3 | `#4A453E` | `#C2C8C6` | Neutral chip text |
| muted | `#6B655C` | `#9AA5A3` | Secondary text |
| primary | `#0F5C63` | `#5CC8C2` | Actions, active nav, progress |
| onPrimary | `#FFFFFF` | `#1A2221` | Text on primary |
| primaryTint | `#E6F0F0` | `#173332` | Selected, info banners, tags |
| accent (saffron) | `#E8A33D` | `#F2B85C` | Premium, celebrations, AI label — **fill only, never text** |
| onAccent | `#2A1A00` | `#2A1A00` | Text on saffron |
| warning text | `#8A5A12` | `#E0C27A` | Deadlines ≤ 30 days |
| warning bg | `#FBF1DF` | `#33291A` | |
| warning border/icon | `#B7791F` | `#C9A15A` | Not for text (fails contrast) |
| danger | `#B42318` | `#F0A49B` | ≤ 7 days, expired, scams, urgent |
| danger bg | `#FDECEA` | `#3A1F1C` | |
| success text | `#24653F` | `#7FD3A0` | Done, valid |
| success fill | `#2E7D4F` | `#7FD3A0` | Checkboxes |
| success bg | `#EAF4EE` | `#1D3327` | |

All text pairs pass WCAG 2.2 AA (4.5:1). The full hex-to-hex map is the `k` object in any `design-source` component.

### Type
- Latin: **Inter**. Devanagari: **Noto Sans Devanagari**, with about **+15 % line height**.
- Scale (size / line height): Display 28/34 (700), Large title 32/38 iOS, Title 20/28, Heading 17/24 (600), Body 15/22 (web 16/24), Caption 13/19.
- German official terms: an outlined **"DE" tag** (10–11 px, 700, primary border) + the term in medium weight, with an audio button where space allows.
- Respect system text size up to 200 %. Buttons and tabs must allow **two lines** (Nepali and Hindi run 20–40 % longer).

### Space, shape, elevation
- 4-pt spacing: 4, 8, 12, 16, 24, 32, 48. Screen side padding 16.
- Radius: 8 (inputs), 12 (buttons), 16 (iOS cards), 20 (Android cards), 999 (chips/pills).
- Elevation: level 1 = 1 px border; level 2 = `0 6px 20px rgba(31,29,26,0.12)` (sheets, dialogs).
- Touch targets: ≥ 44×44 pt iOS, ≥ 48×48 dp Android, ≥ 44 px web.

---

## 6. Components to build (`src/ui/`)

Build these first and render them in a dev-only **Storybook-style gallery route** (`/dev/gallery`) that mirrors `Library.dc.html`, in light and dark.

| Component | Variants | Design reference |
|---|---|---|
| Button | primary, secondary, text, destructive, premium; loading | `Library` |
| TaskItem | open, done, overdue, hidden (checkbox, title, DE term, deadline chip, guide link) | `RoadmapScreen`, `Library` |
| DeadlineChip | neutral > 30 d, warning ≤ 30 d, danger ≤ 7 d / expired, done | `Library` |
| GermanTerm | inline, with audio | `Library`, `GuideScreen` |
| GuideCard | default, saved, updated recently | `GuidesScreen` |
| Callout | tip (teal), warning (amber), common mistake (red), legal notice (grey) | `GuideScreen` |
| ProviderCard / ProviderTable | default, highlighted, referral; table on web desktop | `ComparePage`, `WebCompare` |
| ProgressRing / ProgressBar | stage ring; work-limit bar (amber near limit) | `HomeScreen`, `Calculators` |
| AIResultBlock | "AI" label header; summary, deadline, next steps, key terms, original text | `LetterResult` |
| PremiumLock | tile overlay, inline upgrade card | `AssistHub`, `LetterResult` |
| AdSlot | banner, native card — fixed size, "Ad" label | `Library` |
| AlertBanner | info, rule change (dismissible), urgent (not dismissible) | `HomeScreen`, `LetterResult` |
| Sheet / Modal | add reminder, share, filters | `AddReminderSheet` |
| ChatBubble | user, AI, AI with source chips, legal-help card | `AiTools tool=chat` |
| AppBar | ios / android, large or small, back, action | `AppBar` |
| TabBar | ios / android / mobile-web, active tab, dark | `TabBar` |
| WebShell | site header, breadcrumbs, title, side column, footer | `WebShell`, `WebGuide` |
| EmptyState, Skeleton, ErrorState, OfflineBanner, OutdatedBanner | | `States` |

---

## 7. Features and integrations

### 7.1 Navigation
Five tabs everywhere: **Home · Guides · Assist (centre, highlighted) · Tools · Me**. Search (guides, tools, German words, common misspellings such as "anmeldun") reachable from Home and Guides. Leave room for future tabs or sections (community Q&A, job board, other countries — out of scope now).

### 7.2 Onboarding (9 steps, all skippable, editable later in Me)
Welcome + language → nationality → status → city → stage → arrival date (optional) → notification explainer **then** the system prompt → optional account (16+ confirmation, "Continue without account" keeps data on device) → "Your roadmap is ready". Frames `*-onboard-1…9`.

### 7.3 Roadmap, guides, reminders
- Journey stages: Before arrival · First 30 days · Living in Germany · Career and staying on. Profile sets the current stage; Home focuses on it.
- Ticking a task: small saffron celebration + progress ring update. Users can add their own tasks and hide tasks.
- Reminders default to 90 / 30 / 7 days before. **Free tier stores dates and notes only — never document images** (say so on screen).
- Offline: opened guides, roadmap and reminders must work offline; show the subtle offline banner, never an error screen. AI features show "Needs internet".

### 7.4 AI (Premium, Assist tab)
- Letter explainer: capture (multi-page, edge detection, retake/crop, upload PDF/photo) → calm step-by-step processing → result in this order: who sent it, what they want, deadline (+ Add to reminders), what to do next, key terms, original text (collapsible, German + translation) → actions (write a reply, ask a follow-up, related guide, save, share).
- **Urgent/legal letters** (deportation, court, refusal hearing) → red non-dismissible banner pointing to human help (`*-result-urgent`).
- Reply writer, assistant chat (answers cite guides as chips; legal questions get the legal-help card), housing scam checker (risk level with icon + word; **never says "safe"**), rental contract explainer (fixed legal notice), form assistant, job kit, conversation practice.
- Every AI screen shows an "AI" label, says answers are general information, and links to human help. Scans are deleted after processing unless the user saves them.
- All AI calls go through **your backend** (auth, rate limits, free-scan counting, deletion). The client never holds model keys.
- Free users: **3 letter scans a month**, shown **before** a scan starts. After the last free scan the result still shows in full, followed by a soft upgrade card.

### 7.5 Monetization (must never block free information)
- Premium: €3.99 / month or €29.99 / year ("Save 37 %"), 7-day free trial, price after trial stated clearly, cancel note, restore purchases (apps), terms + privacy links, visible close, **no countdown timers or fake scarcity**.
- One entitlement across platforms via RevenueCat.

### 7.6 Ads (free tier only)
| Placement | Format | Rule |
|---|---|---|
| Home, below the fold | Native card | Labelled "Ad" |
| Guide page, after summary box | Banner or native | Never inside steps or checklists |
| Guide page, before sources | Banner or native | |
| Guides list | Native card every 8 items | |
| Tools results | Banner below results | Never between input and result |
| AI screens, paywall, onboarding, emergency, document dates | **None** | |

No pop-up, interstitial or video ads. Fixed-size slots (no layout shift). Block payday loans, gambling, unlicensed immigration agents, "guaranteed visa" offers.

### 7.7 Referrals and comparisons
Every referral link shows "Referral link: we may earn a commission at no cost to you." Sorting must include a non-commission option (default: lowest fees). Non-partners are listed too. "How we make money" page linked from comparisons and Me.

### 7.8 Consent and privacy (EU)
- Consent on first launch and first web visit, **before** any personalised ads or non-essential tracking. "Accept all", "Reject all", "Settings" with **equal visual weight**. Changeable any time (Me › Privacy; web footer "Cookie settings").
- Me › Privacy: what is stored, toggles, Download my data, Delete my account.
- Legal elements: Impressum + privacy policy (web footer, Me), general-information notice on guides and AI, AI label, referral disclosure, 16+ confirmation, source + "last verified" date on every guide. Guides older than 6 months show "We're re-checking this guide".

---

## 8. Content model (CMS) — nothing factual is hard-coded

- **Guide**: title, German term (+ audio), stage, city (optional), reading time, `lastVerified`, summary (what / when / deadline), steps (documents, where, cost, wait), documents checklist, callouts, related tools/guides, official sources. Localised (en/ne/hi).
- **City**: facts (rent range, transit), appointment instructions + links, community places (name, kind, map pin), each with "Report a change".
- **Rules**: work-day limits, blocked-account amounts, mini-job limits, etc. — used by calculators and guides so they update without an app release.
- **RuleChange**: date, affected groups (nationality, status, city), summary, linked guide. Push only to affected profiles.
- **Provider** (comparisons): category, fees, opening time, payout terms, facts, referral flag + URL, `lastChecked`.
- **Phrase**: situation, German, transliteration (Devanagari), meaning (en/ne/hi), audio.
- **Help service**, **Scam warning**, **Embassy contact**.

All bracketed placeholders in the designs map to these fields.

---

## 9. Accessibility (WCAG 2.2 AA)
Screen-reader labels on every control (`accessibilityLabel`, web `aria-*`), focus order, reduced motion, text scaling to 200 %, status never by colour alone, 4.5:1 text contrast, touch targets per §5. Use real buttons and links (web semantics on React Native Web).

---

## 10. Build order
1. Repo scaffold, tokens, fonts, i18n, theme (light/dark), `/dev/gallery` with all §6 components.
2. Navigation shells: iOS tabs, Android tabs, web header + mobile-web tabs (`WebShell`).
3. Onboarding → Home → Roadmap → Guides list → **Guide page (static web rendering, SEO)** → Reminders (+ local notifications).
4. Tools: comparisons, calculators, phrasebook, safety, city page, rule-change alerts.
5. Me, privacy, subscription, How we make money, Where to get help, consent.
6. Assist: hub, scanner/upload, processing, letter result (incl. urgent), reply writer, then chat, scam checker, contract, forms, job kit, practice.
7. Payments (RevenueCat), ads (AdMob/AdSense) with consent gating.
8. States everywhere: empty, loading (skeletons), error (plain words + retry, never codes), offline, outdated, limit reached.
9. Release pipelines for all three.

## 11. Definition of done (per screen)
- Matches its frame for **each** platform listed in Appendix A (side-by-side screenshot check, light and dark on apps).
- Works at 200 % text size and in Nepali/Hindi without clipping (compare `*-home-ne`, `*-home-hi`).
- Passes an automated a11y check (web: axe; apps: accessibility inspector spot-check).
- Ads and consent behave per §7.6–7.8; no ad renders before consent.
- Builds green: `eas build -p all` and `npx expo export -p web`.

## 12. Open items for the product owner (don't guess — leave TODOs)
Real content for every placeholder; official App Store / Google Play badge artwork; native-speaker review of Nepali and Hindi copy and transliterations; final ad partner list; backend/CMS hosting choice; stage illustrations (only simple placeholders exist); web dark mode (not designed).

---

## Appendix A — screens, routes and frames

Frame names are files in `design-source/` (add `.dc.html`). "—" means not designed for that platform.

| Screen | Route (Expo Router) | Design component | iOS | iOS dark | Android | Android dark | Web desktop | Web mobile |
|---|---|---|---|---|---|---|---|---|
| onboard-1 | `/onboarding/1` | Onboarding step=1 | `ios-onboard-1` | `ios-onboard-1-dark` | `and-onboard-1` | `and-onboard-1-dark` | `web-onboard-1-desktop` | `web-onboard-1-mobile` |
| onboard-2 | `/onboarding/2` | Onboarding step=2 | `ios-onboard-2` | `ios-onboard-2-dark` | `and-onboard-2` | `and-onboard-2-dark` | `web-onboard-2-desktop` | `web-onboard-2-mobile` |
| onboard-3 | `/onboarding/3` | Onboarding step=3 | `ios-onboard-3` | `ios-onboard-3-dark` | `and-onboard-3` | `and-onboard-3-dark` | `web-onboard-3-desktop` | `web-onboard-3-mobile` |
| onboard-4 | `/onboarding/4` | Onboarding step=4 | `ios-onboard-4` | `ios-onboard-4-dark` | `and-onboard-4` | `and-onboard-4-dark` | `web-onboard-4-desktop` | `web-onboard-4-mobile` |
| onboard-5 | `/onboarding/5` | Onboarding step=5 | `ios-onboard-5` | `ios-onboard-5-dark` | `and-onboard-5` | `and-onboard-5-dark` | `web-onboard-5-desktop` | `web-onboard-5-mobile` |
| onboard-6 | `/onboarding/6` | Onboarding step=6 | `ios-onboard-6` | `ios-onboard-6-dark` | `and-onboard-6` | `and-onboard-6-dark` | `web-onboard-6-desktop` | `web-onboard-6-mobile` |
| onboard-7 | `/onboarding/7` | Onboarding step=7 | `ios-onboard-7` | `ios-onboard-7-dark` | `and-onboard-7` | `and-onboard-7-dark` | `web-onboard-7-desktop` | `web-onboard-7-mobile` |
| onboard-8 | `/onboarding/8` | Onboarding step=8 | `ios-onboard-8` | `ios-onboard-8-dark` | `and-onboard-8` | `and-onboard-8-dark` | `web-onboard-8-desktop` | `web-onboard-8-mobile` |
| onboard-9 | `/onboarding/9` | Onboarding step=9 | `ios-onboard-9` | `ios-onboard-9-dark` | `and-onboard-9` | `and-onboard-9-dark` | `web-onboard-9-desktop` | `web-onboard-9-mobile` |
| home | `/(tabs)/index` | HomeScreen | `ios-home` | `ios-home-dark` | `and-home` | `and-home-dark` | `web-home-desktop` | `web-home-mobile` |
| roadmap | `/roadmap/[stage]` | RoadmapScreen | `ios-roadmap` | `ios-roadmap-dark` | `and-roadmap` | `and-roadmap-dark` | `web-roadmap-desktop` | `web-roadmap-mobile` |
| guides | `/(tabs)/guides` | GuidesScreen | `ios-guides` | `ios-guides-dark` | `and-guides` | `and-guides-dark` | `web-guides-desktop` | `web-guides-mobile` |
| guide | `/guides/[slug]` | GuideScreen / WebGuide | `ios-guide` | `ios-guide-dark` | `and-guide` | `and-guide-dark` | `web-guide-desktop` | `web-guide-mobile` |
| city | `/guides/city/[city]` | CityPage | `ios-city` | `ios-city-dark` | `and-city` | `and-city-dark` | `web-city-desktop` | `web-city-mobile` |
| reminders | `/me/reminders` | RemindersScreen | `ios-reminders` | `ios-reminders-dark` | `and-reminders` | `and-reminders-dark` | `web-reminders-desktop` | `web-reminders-mobile` |
| add-reminder | `/me/reminders/new (sheet)` | AddReminderSheet | `ios-add-reminder` | `ios-add-reminder-dark` | `and-add-reminder` | `and-add-reminder-dark` | `web-add-reminder-desktop` | `web-add-reminder-mobile` |
| assist | `/(tabs)/assist` | AssistHub | `ios-assist` | `ios-assist-dark` | `and-assist` | `and-assist-dark` | `web-assist-desktop` | `web-assist-mobile` |
| capture | `/assist/scan` | LetterFlow step=capture (web: step=upload) | `ios-capture` | — | `and-capture` | — | `web-upload-desktop` | `web-upload-mobile` |
| processing | `/assist/scan/processing` | LetterFlow step=processing | `ios-processing` | `ios-processing-dark` | `and-processing` | `and-processing-dark` | `web-processing-desktop` | `web-processing-mobile` |
| result | `/assist/letters/[id]` | LetterResult | `ios-result` | `ios-result-dark` | `and-result` | `and-result-dark` | `web-result-desktop` | `web-result-mobile` |
| result-urgent | `/assist/letters/[id] (urgent)` | LetterResult urgent=true | `ios-result-urgent` | — | `and-result-urgent` | — | `web-result-urgent-desktop` | `web-result-urgent-mobile` |
| reply | `/assist/reply` | ReplyWriter | `ios-reply` | `ios-reply-dark` | `and-reply` | `and-reply-dark` | `web-reply-desktop` | `web-reply-mobile` |
| chat | `/assist/ask` | AiTools tool=chat | `ios-chat` | `ios-chat-dark` | `and-chat` | `and-chat-dark` | `web-chat-desktop` | `web-chat-mobile` |
| scam | `/assist/scam-check` | AiTools tool=scam | `ios-scam` | `ios-scam-dark` | `and-scam` | `and-scam-dark` | `web-scam-desktop` | `web-scam-mobile` |
| contract | `/assist/contract` | AiTools tool=contract | `ios-contract` | `ios-contract-dark` | `and-contract` | `and-contract-dark` | `web-contract-desktop` | `web-contract-mobile` |
| form | `/assist/forms/[form]` | AiTools tool=form | `ios-form` | `ios-form-dark` | `and-form` | `and-form-dark` | `web-form-desktop` | `web-form-mobile` |
| jobkit | `/assist/job-kit` | AiTools tool=jobkit | `ios-jobkit` | `ios-jobkit-dark` | `and-jobkit` | `and-jobkit-dark` | `web-jobkit-desktop` | `web-jobkit-mobile` |
| practice | `/assist/practice` | AiTools tool=practice | `ios-practice` | `ios-practice-dark` | `and-practice` | `and-practice-dark` | `web-practice-desktop` | `web-practice-mobile` |
| practice-summary | `/assist/practice/summary` | AiTools tool=summary | `ios-practice-summary` | `ios-practice-summary-dark` | `and-practice-summary` | `and-practice-summary-dark` | `web-summary-desktop` | `web-summary-mobile` |
| paywall | `/premium (modal)` | Paywall / WebPaywall | `ios-paywall` | `ios-paywall-dark` | `and-paywall` | `and-paywall-dark` | `web-paywall-desktop` | `web-paywall-mobile` |
| consent | `global consent modal` | Consent / WebConsent | `ios-consent` | `ios-consent-dark` | `and-consent` | `and-consent-dark` | `web-consent-desktop` | `web-consent-mobile` |
| compare-blocked | `/tools/compare/blocked-accounts` | ComparePage / WebCompare topic=blocked | `ios-compare-blocked` | `ios-compare-blocked-dark` | `and-compare-blocked` | `and-compare-blocked-dark` | `web-compare-desktop` | `web-compare-mobile` |
| compare-bank | `/tools/compare/bank-accounts` | ComparePage / WebCompare topic=bank | `ios-compare-bank` | `ios-compare-bank-dark` | `and-compare-bank` | `and-compare-bank-dark` | `web-compare-bank-desktop` | `web-compare-bank-mobile` |
| budget | `/tools/budget` | Calculators tool=budget | `ios-budget` | `ios-budget-dark` | `and-budget` | `and-budget-dark` | `web-budget-desktop` | `web-budget-mobile` |
| netpay | `/tools/net-pay` | Calculators tool=netpay | `ios-netpay` | `ios-netpay-dark` | `and-netpay` | `and-netpay-dark` | `web-netpay-desktop` | `web-netpay-mobile` |
| worklimit | `/tools/work-limit` | Calculators tool=worklimit | `ios-worklimit` | `ios-worklimit-dark` | `and-worklimit` | `and-worklimit-dark` | `web-worklimit-desktop` | `web-worklimit-mobile` |
| phrasebook | `/tools/phrasebook` | Reference screen=phrasebook | `ios-phrasebook` | `ios-phrasebook-dark` | `and-phrasebook` | `and-phrasebook-dark` | `web-phrasebook-desktop` | `web-phrasebook-mobile` |
| safety | `/tools/safety` | Reference screen=safety | `ios-safety` | `ios-safety-dark` | `and-safety` | `and-safety-dark` | `web-safety-desktop` | `web-safety-mobile` |
| alerts | `/alerts` | Reference screen=alerts | `ios-alerts` | `ios-alerts-dark` | `and-alerts` | `and-alerts-dark` | `web-alerts-desktop` | `web-alerts-mobile` |
| me | `/(tabs)/me` | MeScreens screen=me | `ios-me` | `ios-me-dark` | `and-me` | `and-me-dark` | `web-me-desktop` | `web-me-mobile` |
| privacy | `/me/privacy` | MeScreens screen=privacy | `ios-privacy` | `ios-privacy-dark` | `and-privacy` | `and-privacy-dark` | `web-privacy-desktop` | `web-privacy-mobile` |
| subscription | `/me/subscription` | MeScreens screen=subscription | `ios-subscription` | `ios-subscription-dark` | `and-subscription` | `and-subscription-dark` | `web-subscription-desktop` | `web-subscription-mobile` |
| money | `/how-we-make-money` | InfoPages page=money | `ios-money` | — | `and-money` | — | `web-money-desktop` | `web-money-mobile` |
| help | `/get-help` | InfoPages page=help | `ios-help` | — | `and-help` | — | `web-help-desktop` | `web-help-mobile` |
| state-empty | `state (any screen)` | States state=empty | `ios-state-empty` | `ios-state-empty-dark` | `and-state-empty` | `and-state-empty-dark` | `web-state-empty-desktop` | `web-state-empty-mobile` |
| state-loading | `state (any screen)` | States state=loading | `ios-state-loading` | `ios-state-loading-dark` | `and-state-loading` | `and-state-loading-dark` | `web-state-loading-desktop` | `web-state-loading-mobile` |
| state-error | `state (any screen)` | States state=error | `ios-state-error` | `ios-state-error-dark` | `and-state-error` | `and-state-error-dark` | `web-state-error-desktop` | `web-state-error-mobile` |
| state-offline | `state (any screen)` | States state=offline | `ios-state-offline` | `ios-state-offline-dark` | `and-state-offline` | `and-state-offline-dark` | `web-state-offline-desktop` | `web-state-offline-mobile` |
| state-outdated | `state (any screen)` | States state=outdated | `ios-state-outdated` | `ios-state-outdated-dark` | `and-state-outdated` | `and-state-outdated-dark` | `web-state-outdated-desktop` | `web-state-outdated-mobile` |
| state-limit | `state (any screen)` | LetterResult lastFree=true | `ios-state-limit` | `ios-state-limit-dark` | `and-state-limit` | `and-state-limit-dark` | `web-state-limit-desktop` | `web-state-limit-mobile` |
| home-ne | `(i18n check, Nepali)` | LocalHome lang=ne | `ios-home-ne` | — | `and-home-ne` | — | — | — |
| home-hi | `(i18n check, Hindi)` | LocalHome lang=hi | — | — | `and-home-hi` | — | — | — |
| home-en-ref | `(i18n reference)` | HomeScreen | `ios-home-en-ref` | — | `and-home-en-ref` | — | — | — |
**Web-only frames:** `web-home-desktop/mobile` (signed-in Home), `web-guide-desktop/mobile` (public SEO guide), `web-compare-desktop/mobile`, `web-compare-bank-desktop/mobile`, `web-paywall-desktop/mobile`, `web-consent-desktop/mobile` and `web-consent-settings-desktop/mobile`. There are also three early web dark samples: `web-guide-desktop-dark`, `web-paywall-desktop-dark` and `web-home-mobile-dark`. Treat these as a reference only, because web dark mode is out of scope for now.
