#!/usr/bin/env bash
# Capture demo videos locally by:
#   1. Building and starting the Next.js server
#   2. Running the Playwright recording script
#   3. Shutting down the server when done
#
# Usage: bash scripts/capture-local.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_DIR"

# ── Build the project first (faster serving than dev mode) ──────────────
echo "▸ Building Next.js project..."
npm run build

# ── Start the production server in the background ───────────────────────
echo "▸ Starting Next.js server on port 3000..."
npm run start -- -p 3000 &
SERVER_PID=$!

# Make sure we kill the server on exit (success or failure)
cleanup() {
  echo "▸ Shutting down server (PID $SERVER_PID)..."
  kill "$SERVER_PID" 2>/dev/null || true
  wait "$SERVER_PID" 2>/dev/null || true
}
trap cleanup EXIT

# ── Wait for the server to be ready ─────────────────────────────────────
echo "▸ Waiting for server to be ready..."
for i in $(seq 1 30); do
  if curl -sf http://localhost:3000 > /dev/null 2>&1; then
    echo "  Server is ready!"
    break
  fi
  if [ "$i" -eq 30 ]; then
    echo "  ERROR: Server did not start within 30 seconds"
    exit 1
  fi
  sleep 1
done

# ── Run the recording script ───────────────────────────────────────────
echo "▸ Recording demos..."
npx tsx scripts/record-demos.ts

echo "▸ Done! Recordings are in the recordings/ directory."
