#!/usr/bin/env bash
set -euo pipefail

# This folder is intentionally empty in this repository state.
# Keep this test so CI verifies the project scaffold still exists.
if [ ! -d "rust-client-server" ]; then
  echo "rust-client-server directory missing"
  exit 1
fi

echo "rust-client-server scaffold test passed"
