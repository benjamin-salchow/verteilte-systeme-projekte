# Verteilte Systeme: Beispielprojekte

Diese Sammlung enthält praxisnahe Beispielprojekte als Grundlage für die Projektarbeit im Modul **Verteilte Systeme**.

## Für wen ist dieses Repo?

Für Studierende, die schnell ein lauffähiges Grundgerüst für Client-Server-Kommunikation, Containerisierung und Datenbankanbindung benötigen.

## Lernziele

Mit den Beispielen kannst du insbesondere üben:

- Aufbau von **Client-Server-Architekturen**
- Entwicklung von **REST-APIs**
- Einbindung von **SQL-Datenbanken**
- Nutzung von **Docker** und `docker-compose`
- Vergleich verschiedener Sprachen/Frameworks für denselben Use Case

## Schnellstart

1. Repository klonen.
2. In einen Beispielordner wechseln.
3. Dort (falls vorhanden) die lokale Anleitung in der jeweiligen `README.md` lesen.
4. In der Regel starten die Projekte mit:

```sh
docker-compose up --build
```

Hinweis: Nicht jedes Beispiel hat dieselbe Ordnerstruktur oder identische Abhängigkeiten. Nutze deshalb immer die Anleitung im jeweiligen Unterordner.

## Empfohlener Einstieg

Wenn du neu startest, nimm diese Reihenfolge:

1. `node-client-server`
2. `node-client-server-extended`
3. ein Datenbankbeispiel deiner Sprache (z. B. Python, Go, Java, C#, C++, Rust)

## Beispielübersicht

## Node.js

- **Client-Server plain TCP**
  - Anleitung: [node-plain-tcp/README.md](node-plain-tcp/README.md)
  - Ordner: [node-plain-tcp](node-plain-tcp/)
- **Client-Server Webserver**
  - Anleitung: [node-client-server/README.md](node-client-server/README.md)
  - Ordner: [node-client-server](node-client-server/)
- **Message Oriented MQTT**
  - Anleitung: [node-mqtt/README.md](node-mqtt/README.md)
  - Ordner: [node-mqtt](node-mqtt/)
- **Peer2Peer**
  - Anleitung: [node-p2p/README.md](node-p2p/README.md)
  - Ordner: [node-p2p](node-p2p/)
- **Client-Server Webserver - Extended**
  - Anleitung: [node-client-server-extended/README.md](node-client-server-extended/README.md)
  - Ordner: [node-client-server-extended](node-client-server-extended/)
- **Client-Server Webserver - Extended mit Datenbank**
  - Anleitung: [node-client-server-extended-with-database/README.md](node-client-server-extended-with-database/README.md)
  - Ordner: [node-client-server-extended-with-database](node-client-server-extended-with-database/)
- **Client-Server Webserver - Extended mit Datenbank und Nodemon**
  - Anleitung: [node-client-server-extended-with-database-nodemon/README.md](node-client-server-extended-with-database-nodemon/README.md)
  - Ordner: [node-client-server-extended-with-database-nodemon](node-client-server-extended-with-database-nodemon/)

## PHP

- **Client-Server Webserver**
  - Anleitung: [php-client-server/README.md](php-client-server/README.md)
  - Ordner: [php-client-server](php-client-server/)
- **Client-Server Webserver mit Datenbank**
  - Anleitung: [php-client-server-with-database/README.md](php-client-server-with-database/README.md)
  - Ordner: [php-client-server-with-database](php-client-server-with-database/)

## Java (Spring)

- **Client-Server Webserver**
  - Anleitung: [java-spring-client-server/README.md](java-spring-client-server/README.md)
  - Ordner: [java-spring-client-server](java-spring-client-server/)
- **Client-Server Webserver mit Datenbank**
  - Anleitung: [java-spring-client-server-with-database/README.md](java-spring-client-server-with-database/README.md)
  - Ordner: [java-spring-client-server-with-database](java-spring-client-server-with-database/)
- **Message Oriented MQTT**
  - Anleitung: [java-spring-mqtt/README.md](java-spring-mqtt/README.md)
  - Ordner: [java-spring-mqtt](java-spring-mqtt/)

## Python

- **Client-Server Webserver mit Datenbank**
  - Anleitung: [python-client-server-with-database/README.md](python-client-server-with-database/README.md)
  - Ordner: [python-client-server-with-database](python-client-server-with-database/)

## Go

- **Client-Server Webserver mit Datenbank**
  - Anleitung: [golang-client-server-with-database/README.md](golang-client-server-with-database/README.md)
  - Ordner: [golang-client-server-with-database](golang-client-server-with-database/)

## C# / .NET

- **Client-Server Webserver mit Datenbank**
  - Anleitung: [csharp-client-server-with-database/README.md](csharp-client-server-with-database/README.md)
  - Ordner: [csharp-client-server-with-database](csharp-client-server-with-database/)

## C++

- **Client-Server Webserver mit Datenbank**
  - Anleitung: [cplusplus-client-server-with-database/README.md](cplusplus-client-server-with-database/README.md)
  - Ordner: [cplusplus-client-server-with-database](cplusplus-client-server-with-database/)

## Rust

- **Client-Server Webserver mit Datenbank**
  - Anleitung: [rust-client-server-with-database/README.md](rust-client-server-with-database/README.md)
  - Ordner: [rust-client-server-with-database](rust-client-server-with-database/)

## Hinweise zur Projektarbeit

- Du darfst andere Sprachen oder Frameworks verwenden, wenn sie mit der Lehrveranstaltung abgestimmt sind.
- Nutze die Beispiele als **Startpunkt**, nicht als starre Vorgabe.
- Achte auf saubere Struktur, nachvollziehbare README-Dokumentation und reproduzierbare Builds.

## Troubleshooting (kurz)

- Port belegt: Ports in `docker-compose.yaml` anpassen.
- Container startet nicht: Logs prüfen mit `docker-compose logs -f`.
- Altes DB-Schema wird weiterverwendet: Container/Volumes sauber neu starten (`docker-compose down`).

## Lizenz

Siehe [LICENSE](LICENSE).
