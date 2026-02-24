#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LICENSE_FILE="$ROOT_DIR/THIRD_PARTY_LICENSES.md"
CMAKE_FILE="$ROOT_DIR/server/CMakeLists.txt"
README_FILE="$ROOT_DIR/README.md"

fail() {
  echo "ERROR: $1" >&2
  exit 1
}

[[ -f "$LICENSE_FILE" ]] || fail "Missing THIRD_PARTY_LICENSES.md"
[[ -f "$CMAKE_FILE" ]] || fail "Missing server/CMakeLists.txt"
[[ -f "$README_FILE" ]] || fail "Missing README.md"

# Ensure immutable dependency pin is present.
grep -q "GIT_TAG af56b7ec0ba9d18b788ed064f76d936eb52c5db5" "$CMAKE_FILE" || \
  fail "cpp-httplib is not pinned to the expected commit hash"

# Ensure license inventory contains the direct critical components.
grep -qi "cpp-httplib" "$LICENSE_FILE" || fail "cpp-httplib missing from THIRD_PARTY_LICENSES.md"
grep -qi "nlohmann/json" "$LICENSE_FILE" || fail "nlohmann/json missing from THIRD_PARTY_LICENSES.md"
grep -qi "libmariadb" "$LICENSE_FILE" || fail "libmariadb missing from THIRD_PARTY_LICENSES.md"
grep -qi "LGPL" "$LICENSE_FILE" || fail "LGPL note missing from THIRD_PARTY_LICENSES.md"

# Ensure the main README points to license inventory.
grep -q "THIRD_PARTY_LICENSES.md" "$README_FILE" || \
  fail "README.md does not reference THIRD_PARTY_LICENSES.md"

echo "Compliance checks passed."
