#!/usr/bin/env bash
# Spins up a throwaway local PostgreSQL, applies the Supabase stub, the migrations,
# the seed and the SQL tests. Usage: scripts/test-db.sh   (needs PostgreSQL 15+ binaries)
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PGBIN="${PGBIN:-$(dirname "$(command -v postgres 2>/dev/null || ls /usr/lib/postgresql/*/bin/postgres | tail -1)")}"
DIR="$(mktemp -d)"
PORT="${PGPORT_TEST:-54329}"
RUN_AS=()
if [ "$(id -u)" = "0" ]; then chown -R postgres "$DIR" 2>/dev/null || true; RUN_AS=(su postgres -s /bin/bash -c); fi
run() { if [ ${#RUN_AS[@]} -gt 0 ]; then "${RUN_AS[@]}" "$*"; else bash -c "$*"; fi; }
cleanup() { run "$PGBIN/pg_ctl -D $DIR/data stop -m fast" >/dev/null 2>&1 || true; rm -rf "$DIR"; }
trap cleanup EXIT
run "$PGBIN/initdb -D $DIR/data -U postgres --auth=trust" >/dev/null
run "$PGBIN/pg_ctl -D $DIR/data -o '-p $PORT -k $DIR' -l $DIR/log start -w" >/dev/null
PSQL=(psql -h "$DIR" -p "$PORT" -U postgres -d postgres -v ON_ERROR_STOP=1 -q -X)
"${PSQL[@]}" -f "$ROOT/supabase/tests/supabase_stub.sql"
for f in "$ROOT"/supabase/migrations/*.sql; do "${PSQL[@]}" -f "$f"; done
"${PSQL[@]}" -f "$ROOT/supabase/seed.sql"
"${PSQL[@]}" -f "$ROOT/supabase/tests/content_cms_test.sql"
(cd "$ROOT" && npx tsx scripts/validate-parity-sql.ts) > "$DIR/parity.sql"
"${PSQL[@]}" -f "$DIR/parity.sql"
echo "Database tests passed."
