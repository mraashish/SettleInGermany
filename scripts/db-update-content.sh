#!/usr/bin/env bash
# Brings the Supabase content database up to date with the content bundled in the app
# (src/content/seed.ts) and publishes it in one release — iOS, Android and the web
# show it right away.
#
# Usage:
#   npm run db:update-content                 # uses SUPABASE_DB_URL from the environment or .env.local
#   npm run db:update-content -- "<url>"      # or pass the connection string
#   npm run db:update-content -- --initial    # first import into an empty database (seed.sql)
#
# The connection string is in Supabase: Project › Connect › "Session pooler"
# (postgresql://postgres.<ref>:<password>@<host>:5432/postgres). It contains the
# database password: keep it in .env.local (not committed), never in .env.example.
#
# Documents with the same key are replaced by the bundled version; their earlier
# versions stay in the history (content_revisions). Needs psql (PostgreSQL client).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

FILE="seed-update.sql"
URL=""
for arg in "$@"; do
  case "$arg" in
    --initial) FILE="seed.sql" ;;
    -h|--help) sed -n '2,16p' "$0"; exit 0 ;;
    *) URL="$arg" ;;
  esac
done

if [ -z "$URL" ]; then URL="${SUPABASE_DB_URL:-}"; fi
if [ -z "$URL" ] && [ -f "$ROOT/.env.local" ]; then
  URL="$(grep -E '^SUPABASE_DB_URL=' "$ROOT/.env.local" | tail -1 | cut -d= -f2- | sed -e 's/^["'\'']//' -e 's/["'\'']$//')"
fi
if [ -z "$URL" ]; then
  echo "No database connection string." >&2
  echo "Set SUPABASE_DB_URL in .env.local, or run: npm run db:update-content -- \"postgresql://...\"" >&2
  exit 1
fi
if ! command -v psql >/dev/null 2>&1; then
  echo "psql is not installed. On a Mac: brew install libpq && brew link --force libpq" >&2
  exit 1
fi

echo "Generating SQL from src/content/seed.ts…"
(cd "$ROOT" && npx tsx scripts/content-seed-sql.ts >/dev/null)

echo "Applying supabase/$FILE…"
psql "$URL" -v ON_ERROR_STOP=1 -q -X -f "$ROOT/supabase/$FILE"

psql "$URL" -X -q -A -t -c "select 'Live content: ' || count(*) || ' documents · release v' || (select version from public.content_state) from public.published_content;"
echo "Done. The apps and the website pick up the new release automatically."
