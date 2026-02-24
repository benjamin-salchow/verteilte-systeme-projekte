# Client - (Web-)Server mit einer Datenbank in Java Spring

Dieses Beispiel entspricht funktional dem `python-client-server-with-database` Beispiel, nutzt aber einen Java Spring Boot Server.

## Start

```sh
docker-compose up --build
```

Danach:
- App: `http://localhost:8080/`
- PhpMyAdmin: `http://localhost:8085/`

## Struktur

- `server/src/main/java/hello`: Spring Boot Application, Controller, DB-Startup-Check.
- `server/src/main/resources/static`: Statische Dateien (`index.html`, `database.html`, ...).
- `db/database.sql`: Initiales Datenbank-Schema + Beispiel-Daten.
- `docker-compose.yaml`: Startet Server, MariaDB und PhpMyAdmin.

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
