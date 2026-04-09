#!/usr/bin/env bash
set -euo pipefail

API_DIR="src/app/api"
TEMP_API_DIR="src/app/__api_disabled_for_pages__"
SUCCESS_DIR="src/app/success"
TEMP_SUCCESS_DIR="src/app/__success_disabled_for_pages__"

cleanup() {
  if [ -d "$TEMP_API_DIR" ]; then
    mv "$TEMP_API_DIR" "$API_DIR"
  fi

  if [ -d "$TEMP_SUCCESS_DIR" ]; then
    mv "$TEMP_SUCCESS_DIR" "$SUCCESS_DIR"
  fi
}

trap cleanup EXIT

if [ -d "$API_DIR" ]; then
  mv "$API_DIR" "$TEMP_API_DIR"
fi

if [ -d "$SUCCESS_DIR" ]; then
  mv "$SUCCESS_DIR" "$TEMP_SUCCESS_DIR"
fi

STATIC_EXPORT=true next build

touch out/.nojekyll
