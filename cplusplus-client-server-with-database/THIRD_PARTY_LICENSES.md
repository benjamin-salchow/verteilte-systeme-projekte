# Third-Party Licenses

This project depends on third-party software. The table below documents the key direct dependencies, their license, and source.

| Component | Version / Pin | License | Source |
|---|---|---|---|
| cpp-httplib | `af56b7ec0ba9d18b788ed064f76d936eb52c5db5` (tag `v0.16.3`) | MIT | https://github.com/yhirose/cpp-httplib |
| nlohmann/json | Debian package `nlohmann-json3-dev` (Bookworm) | MIT | https://github.com/nlohmann/json |
| MariaDB Connector/C (`libmariadb`) | Debian packages `libmariadb-dev`, `libmariadb3` (Bookworm) | LGPL-2.1-or-later | https://mariadb.com/kb/en/library/mariadb-connector-c/ |
| MySQL/MariaDB server image (`mariadb`) | Container image tag from Docker Hub | GPL-2.0 | https://hub.docker.com/_/mariadb |
| phpMyAdmin image | Container image tag from Docker Hub | GPL-2.0 | https://hub.docker.com/_/phpmyadmin |
| Debian base image | `bookworm` / `bookworm-slim` | Mixed (Debian archive) | https://www.debian.org/legal/licenses/ |

## LGPL Note (libmariadb)

The server links against `libmariadb` from the OS packages and uses dynamic linking in the runtime image (`libmariadb3` installed separately). This is intentional for typical LGPL compliance workflows.

## Supply Chain Pinning

- `cpp-httplib` is pinned to an immutable commit in `CMakeLists.txt`.
- Runtime dependencies are resolved from Debian repositories in Docker builds.
