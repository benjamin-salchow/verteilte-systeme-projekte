# Client - (Web-)Server mit einer Datenbank in C#/.NET

Dieses Beispiel entspricht funktional dem `python-client-server-with-database` Projekt, nutzt aber einen C# ASP.NET Core Server.

## Start

```sh
docker-compose up --build
```

Danach:
- App: `http://localhost:8080/`
- PhpMyAdmin: `http://localhost:8085/`

## Struktur

- `server/Program.cs`: ASP.NET Core Minimal API mit gleichen Endpunkten wie in den anderen DB-Beispielen.
- `server/public`: Statische Dateien (`index.html`, `database.html`, ...).
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
