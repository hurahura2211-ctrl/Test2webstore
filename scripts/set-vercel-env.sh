#!/usr/bin/env bash
# Usage: ./scripts/set-vercel-env.sh <scope> <project>
# Example: ./scripts/set-vercel-env.sh my-team duitku-digital-store
set -euo pipefail

SCOPE="${1:-}"
PROJECT="${2:-duitku-digital-store}"

if ! command -v vercel >/dev/null 2>&1; then
  echo "Please install Vercel CLI: npm i -g vercel"
  exit 1
fi

# Prompt for secrets if not set as env
: "${DUITKU_MERCHANT_CODE:?"Set env DUITKU_MERCHANT_CODE"}"
: "${DUITKU_API_KEY:?"Set env DUITKU_API_KEY"}"
: "${DUITKU_ENV:=sandbox}"
: "${BASE_URL:?"Set env BASE_URL (https://yourdomain.vercel.app)"}"

echo "Setting envs for project '$PROJECT' (scope: $SCOPE)"
vercel env add DUITKU_MERCHANT_CODE production --scope "$SCOPE" <<<"$DUITKU_MERCHANT_CODE"
vercel env add DUITKU_API_KEY production --scope "$SCOPE" <<<"$DUITKU_API_KEY"
vercel env add DUITKU_ENV production --scope "$SCOPE" <<<"$DUITKU_ENV"
vercel env add BASE_URL production --scope "$SCOPE" <<<"$BASE_URL"

vercel env add DUITKU_MERCHANT_CODE preview --scope "$SCOPE" <<<"$DUITKU_MERCHANT_CODE"
vercel env add DUITKU_API_KEY preview --scope "$SCOPE" <<<"$DUITKU_API_KEY"
vercel env add DUITKU_ENV preview --scope "$SCOPE" <<<"$DUITKU_ENV"
vercel env add BASE_URL preview --scope "$SCOPE" <<<"$BASE_URL"

vercel env add DUITKU_MERCHANT_CODE development --scope "$SCOPE" <<<"$DUITKU_MERCHANT_CODE"
vercel env add DUITKU_API_KEY development --scope "$SCOPE" <<<"$DUITKU_API_KEY"
vercel env add DUITKU_ENV development --scope "$SCOPE" <<<"$DUITKU_ENV"
vercel env add BASE_URL development --scope "$SCOPE" <<<"$BASE_URL"

echo "Done. Trigger a redeploy to apply new envs."
