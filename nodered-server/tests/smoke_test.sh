#!/usr/bin/env bash
set -euo pipefail

# This folder is intentionally empty in this repository state.
# Keep this test so CI verifies the project scaffold still exists.
if [ ! -d "nodered-server" ]; then
  echo "nodered-server directory missing"
  exit 1
fi

echo "nodered-server scaffold test passed"
