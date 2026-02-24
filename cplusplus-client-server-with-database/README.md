# Client - (Web-)Server mit einer Datenbank in C++

Dieses Beispiel entspricht funktional dem `python-client-server-with-database` Projekt, nutzt aber einen modernen C++ Server (CMake + cpp-httplib + MariaDB C Client).

## Start

```sh
docker-compose up --build
```

Danach:
- App: `http://localhost:8080/`
- PhpMyAdmin: `http://localhost:8085/`

## Struktur

- `server/src/main.cpp`: HTTP-Routen + DB-Logik.
- `server/public`: Statische Dateien (`index.html`, `database.html`, ...).
- `db/database.sql`: Initiales Datenbank-Schema + Beispiel-Daten.
- `docker-compose.yaml`: Startet Server, MariaDB und PhpMyAdmin.
- `THIRD_PARTY_LICENSES.md`: Lizenz- und Compliance-Übersicht der externen Komponenten.

## Endpunkte

- `GET /` -> Redirect auf `/static/index.html`
- `GET /special_path`
- `GET /request_info`
- `POST /client_post`
- `POST /button1_name` und `POST /button1_name/`
- `GET /button2`
- `GET /database`
- `POST /database`
- `DELETE /database/{id}`
- `GET /static/...`

## Lizenz & Compliance

- Drittanbieter-Lizenzen sind in `THIRD_PARTY_LICENSES.md` dokumentiert.
- `cpp-httplib` ist in `CMakeLists.txt` auf einen festen Commit gepinnt.
- Ein CI-Workflow erzeugt zusätzlich ein SBOM-Artefakt (SPDX JSON) unter `.github/workflows/cplusplus-compliance.yml`.
