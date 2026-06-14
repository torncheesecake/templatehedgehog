#!/usr/bin/env bash
set -euo pipefail

API_DIR="src/app/api"
TEMP_API_DIR="src/app/__api_disabled_for_pages__"
SUCCESS_DIR="src/app/success"
TEMP_SUCCESS_DIR="src/app/__success_disabled_for_pages__"
CHECKOUT_DIR="src/app/checkout"
TEMP_CHECKOUT_DIR="src/app/__checkout_disabled_for_pages__"
# Localhost-gated alpha route: uses headers()/redirect(), cannot be statically exported and
# must not appear in the public GitHub Pages build. Moved aside during export, restored on exit.
STUDIO_ALPHA_DIR="src/app/studio/private-alpha"
TEMP_STUDIO_ALPHA_DIR="src/app/studio/__private_alpha_disabled_for_pages__"

cleanup() {
  if [ -d "$TEMP_API_DIR" ]; then
    mv "$TEMP_API_DIR" "$API_DIR"
  fi

  if [ -d "$TEMP_SUCCESS_DIR" ]; then
    mv "$TEMP_SUCCESS_DIR" "$SUCCESS_DIR"
  fi

  if [ -d "$TEMP_CHECKOUT_DIR" ]; then
    mv "$TEMP_CHECKOUT_DIR" "$CHECKOUT_DIR"
  fi

  if [ -d "$TEMP_STUDIO_ALPHA_DIR" ]; then
    mv "$TEMP_STUDIO_ALPHA_DIR" "$STUDIO_ALPHA_DIR"
  fi
}

trap cleanup EXIT

if [ -d "$API_DIR" ]; then
  mv "$API_DIR" "$TEMP_API_DIR"
fi

if [ -d "$SUCCESS_DIR" ]; then
  mv "$SUCCESS_DIR" "$TEMP_SUCCESS_DIR"
fi

if [ -d "$CHECKOUT_DIR" ]; then
  mv "$CHECKOUT_DIR" "$TEMP_CHECKOUT_DIR"
fi

if [ -d "$STUDIO_ALPHA_DIR" ]; then
  mv "$STUDIO_ALPHA_DIR" "$TEMP_STUDIO_ALPHA_DIR"
fi

STATIC_EXPORT=true next build --webpack

touch out/.nojekyll
