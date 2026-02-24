# Client - (Web-)Server mit einer Datenbank in Go

Dieses Beispiel entspricht funktional dem `python-client-server-with-database` Projekt, nutzt aber einen Go-Server.

## Start

```sh
docker-compose up --build
```

Danach:
- App: `http://localhost:8080/`
- PhpMyAdmin: `http://localhost:8085/`

## Struktur

- `server/main.go`: Go HTTP-Server mit den gleichen Endpunkten wie in den Python/Node-Beispielen.
- `server/public`: Statische Dateien (`index.html`, `database.html`, ...).
- `db/database.sql`: Initiales Datenbank-Schema + Beispiel-Daten.
- `docker-compose.yaml`: Startet Server, MariaDB und PhpMyAdmin.

## Endpunkte

- `GET /` -> Redirect auf `/static/index.html`
- `GET /special_path`
- `GET /request_info`
- `POST /client_post`
- `POST /button1_name`
- `GET /button2`
- `GET /database`
- `POST /database`
- `DELETE /database/{id}`
- `GET /static/...`
