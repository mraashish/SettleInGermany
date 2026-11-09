# Content management — one database for iOS, Android and the web

All factual content lives in one Supabase (PostgreSQL) database. Editors use the CMS in `cms/`. When they publish, the iOS app, the Android app and the website all update together.

```
                       ┌──────────────────────────── Supabase (one project) ───────────────────────────┐
  Editors ── CMS ───▶  │ content_documents (drafts, editors only)                                      │
  (cms/)               │        │ publish_documents() — ONE transaction, ONE version bump               │
                       │        ▼                                                                       │
                       │ published_content (public, read-only) ◀── apps read collections from here     │
                       │ content_state  { version, changed_collections } ── Realtime ──▶ open apps     │
                       │ content_events (outbox) ── webhook ──▶ Edge Function on-content-published     │
                       └───────────────────────────────────────────────────────┬────────────────────────┘
                                                                               ├─▶ website build hook (static SEO pages)
                                                                               └─▶ Expo push: new rule changes, affected users only
```

## What happens when you click "Publish"

| Where | What updates | How fast |
|---|---|---|
| iOS and Android apps (open) | The changed collections are refetched | Seconds (Realtime on `content_state`) |
| Apps in the background or offline | Refetched when the app is opened again (version check) | On next open |
| Website, open in a browser | Same as the apps (the same React code) | Seconds |
| Website, static HTML for search engines | Rebuilt by the host's build hook | One build (a few minutes) |
| New rule change | Push notification to devices whose nationality / status / city match | Seconds |
| New app installs | Ship with a content snapshot taken at build time, then update live | — |

Nothing reaches users until it is **published**. Saving keeps a draft that only editors can see.

## Data model

| Table | Who can read | Who can write |
|---|---|---|
| `content_documents` | Editors | Editors (insert/update) and admins (delete). `status` can only change through the publish functions |
| `content_revisions` | Editors | Triggers only (every save, publish and unpublish) |
| `published_content` | Everyone (anon) | Publish functions only |
| `content_state` | Everyone | Publish functions only |
| `content_events` | Editors | Publish functions; the Edge Function marks rows processed |
| `cms_editors` | The editor themself; admins see everyone | Admins |
| `push_tokens` | Nobody (service role only) | Devices via `register_push_token()` |

Each document stores its content as JSON in the same shape as `src/content/types.ts`, so the apps read it as-is. There are 10 collections: `guides`, `tasks`, `cities`, `rules` (a single document), `ruleChanges`, `providers`, `phrases`, `helpServices`, `scamWarnings` and `embassies`. Their key fields are listed in `src/content/collections.ts` and mirrored in `public.content_key()`.

**Validation** lives in the database (`public.content_validate()`). The CMS calls it while you edit, and publishing refuses anything invalid. Examples:
- every guide needs an official source and a last-verified date;
- every partner provider needs a referral URL, so the referral disclosure always shows.

The CMS demo mode has a browser copy of these rules. `npm run db:test` checks that both give the same answers.

## Set it up

1. **Create a Supabase project.** Choose an EU region (e.g. Frankfurt) for GDPR.
2. **Create the schema and import the initial content:**
   ```bash
   npx supabase link --project-ref <project-ref>
   npx supabase db push
   psql "<connection string>" -f supabase/seed.sql
   ```
   Already have a database with older content? Run `psql "<connection string>" -f supabase/seed-update.sql` instead. It replaces documents that have the same key with the bundled version and publishes them in one release (earlier versions stay in the history).
   The seed publishes everything that passes validation as release v1: the complete Leipzig content (18 guides, roadmap, city page, rules, providers, phrasebook, help services, safety). Each item lists its official sources and the date it was checked.
3. **Make yourself an admin.** Create your user in *Authentication → Users*, then run:
   ```sql
   insert into public.cms_editors (user_id, email, role)
   select id, email, 'admin' from auth.users where email = 'you@example.com';
   ```
   After that, invite other editors from the CMS (*Editors* page).
4. **Deploy the Edge Functions and set their secrets:**
   ```bash
   npx supabase secrets set CMS_WEBHOOK_SECRET=<long random string> \
     WEB_DEPLOY_HOOK_URL=<your web host's build hook URL> \
     CMS_SITE_URL=https://cms.example.com \
     EXPO_ACCESS_TOKEN=<optional, Expo push security>
   npx supabase functions deploy on-content-published
   npx supabase functions deploy invite-editor
   ```
5. **Connect the publish webhook.** In the SQL editor, run:
   ```sql
   select vault.create_secret('https://<project-ref>.supabase.co/functions/v1/on-content-published', 'cms_events_url');
   select vault.create_secret('<same CMS_WEBHOOK_SECRET>', 'cms_webhook_secret');
   ```
   The `pg_net` extension must be enabled (*Database → Extensions*).
6. **Configure the apps and the CMS.** Copy `.env.example` to `.env.local` and set `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY`. Set the same values:
   - in EAS (`eas env:create`);
   - on your web host.

   The CMS reads the same file.
7. **Set up the website host** (Netlify, Vercel, Cloudflare Pages, …):
   - Build command `npm run build:web`, output directory `dist`.
   - Create a build hook and use its URL as `WEB_DEPLOY_HOOK_URL`.
   - Add a rewrite so pages published between builds already work when opened directly: `/guides/:slug → /guides/[slug].html` (200) and `/guides/city/:city → /guides/city/[city].html` (200).
8. **Run and deploy the CMS:**
   ```bash
   npm --prefix cms install
   npm run cms:dev     # http://localhost:5174
   npm run cms:build   # static files in cms/dist → host on a separate domain, e.g. cms.example.com
   ```
   Security comes from the database's row-level security, not from hiding the CMS URL.

### User accounts (onboarding step 8)

The app's “Continue with Email / Google / Apple” buttons sign in with the same Supabase project. Without Supabase settings the app says that accounts aren't available yet and offers “Continue without an account”.

1. **Email code.** *Authentication → Providers → Email*: enable it. In *Authentication → Email Templates → Magic Link*, include the 6-digit code so people can type it into the app:
   ```html
   <p>Your code for Settle in Germany: <strong>{{ .Token }}</strong></p>
   ```
   Set up your own SMTP server (*Authentication → SMTP Settings*); the built-in one is limited to a few emails an hour.
2. **Google.** Create an OAuth client (type *Web application*) in Google Cloud Console with the redirect URI `https://<project-ref>.supabase.co/auth/v1/callback`. Enter the client ID and secret in *Authentication → Providers → Google*.
3. **Redirect URLs.** In *Authentication → URL Configuration*, add:
   - `settleingermany://auth/callback` (iOS and Android apps);
   - `https://<your web domain>/onboarding/8` (website);
   - `http://localhost:8081/onboarding/8` (local development).
4. **Apple (iOS only).** Enable *Sign in with Apple* for the bundle ID in your Apple Developer account and add the bundle ID to *Authentication → Providers → Apple*.

Without Supabase settings:
- the apps use the bundled seed content;
- the CMS runs in **demo mode**, with the same rules but stored in the browser only.

## Day-to-day

- **Save draft** keeps the change private. **Publish to all platforms** makes it live. The top bar's **Publish N changes** releases every finished change at once and lists anything still incomplete.
- **Take offline** removes a document from every platform and keeps the draft. **Delete** is admin-only.
- **History** shows every save and publish. **Restore** loads an older version into the form.
- The list filters show:
  - unpublished changes;
  - drafts;
  - items that still need Nepali or Hindi (the apps show English until then);
  - guides verified more than 6 months ago (the apps show "We're re-checking this guide").
- **Rules and limits** feed the calculators. Changing a number there updates the apps without an app release.
- **Publishing a new rule change** sends a push notification, in each user's language, only to affected profiles. Editing an existing one doesn't notify again.

## Tests

```bash
npm run db:test        # throwaway local PostgreSQL: schema, RLS, publish workflow, validator parity
npm --prefix cms test  # CMS schema and demo store
npm test               # app logic incl. push targeting
```
