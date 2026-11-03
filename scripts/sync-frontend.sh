#!/usr/bin/env bash
# Syncs the shared frontend UI modules (contexts, components, api client)
# into the Next.js preview shell (src/shop/), which renders the same React
# components on the single visible route.
#
# Run this after editing anything under frontend/src/{api,lib,context,components}.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC="$ROOT/frontend/src"
DEST="$ROOT/src/shop"

rm -rf "$DEST"
mkdir -p "$DEST"

for dir in api lib context components; do
  cp -r "$SRC/$dir" "$DEST/$dir"
done

echo "✅ Synced shared frontend modules → src/shop/"
