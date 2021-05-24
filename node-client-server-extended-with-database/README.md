# Client - (Web-)Server Extended mit einer Datenbank in Node.js

## Allgemein

In diesem Beispiel werden ein Node.js Webserver (mittels Express) gestartet und Zugriffspunkte (Pfäde) definiert. Darüber hinaus wird ein 'mariaDB'-Datenbankcontainer angelegt, welcher vom Webserver verwendet wird.

Bitte schaue zuerst das Beispiel `node-client-server-extended` an: [- node-client-server-extended Beispiel ->](../node-client-server-extended/README.md)

In dieser Anleitung wird nur auf alle Erweiterungen des Extended-Beispiels der Datenbank eingegangen.

![Screenshot](screenshot.png)

### Datenbank

Die Datenbank ist eine `MariaDB`-Datenbank, welche eine OpenSource Weiterentwicklung der `MySQL`-Datenbank ist.

Alles zur Datenbank findet man im Ordner `db`. Dieser wird benötigt, da beim Start der Datenbank das `database.sql` Backup geladen und in die Datenbank automatisch eingespielt wird.

Genau genommen nehmen wir das vorhandene offizielle `MariaDB` Container-Image und laden nur unser SQL-Backup rein. Das `database.sql` kann man über PhpMyAdmin exportieren und einfach überschreiben.

Die Datenbankinitialisierung findet **nur** statt, wenn der Container das erste Mal gestartet wird, sprich, wenn man das erste Mal `docker-compose up --build` ausführt. Bei jedem weiteren Start mittels `docker-compose up --build` werden die vorhandenen Daten genommen und es wird das Backup `database.sql` **nicht** eingespielt.

Konkret bedeutet das, dass beim ersten Start der Datenbank dies etwas länger dauert, bei jedem weiteren Start geht es deutlich schneller. Wenn man möchte, dass die Datenbank komplett gelöscht wird, dann muss man die Container alle löschen mittels `docker-compose down`. Beim nächsten Start mit `docker-compose up --build` wird dann die Datenbank neu erstellt.

### Server

Der Server benötigt die Datenbank und daher darf der Server erst starten, wenn die Datenbank bereit ist. Der einfachste Workaround hierbei ist ein `sleep`, bevor der Server gestartet wird.

Dies wird in der Dockerfile des Servers bei CMD gemacht. In der Praxis würde man z.B. alle X Sekunden prüfen, ob die Datenbank nun verfügbar ist und dann die Verbindung aufbauen.

Bitte öffne nach dem Start folgende URL: `http://localhost:8080/`

Danach wird man automatisch auf die `index.html` geleitet, die im `static` liegt (Ordner: `public` in `server`).
Mit einem Klick auf den `database.html` Link kommt man auf folgende Seite: `http://localhost:8080/static/database.html`.
Dort befindet sich alles über den Datenbankzugriff, was im Folgenden erklärt wird.

Die `database.html` befindet sich in `./server/public/database.html` und beinhaltet den Client (Webbrowser) Code, der im Browser ausgeführt wird.
Dabei werden folgende Zugriffspunkte vom `server.js` verwendet:

Zugriffspunkte:
 * GET http://localhost:8080/database
   * Gibt die komplette `table1` als JSON-Antwort zum Client.
 * DELETE http://localhost:8080/database/`id`
   * Löscht die Reihe aus der `table1` mit der angegebenen `id`.
 * POST http://localhost:8080/database
   * Das übergebene JSON-Objekt an diese URL, welches folgende Struktur haben muss:
   * `{ title: "", description: ""}`
   * wird zur `table1` hinzugefügt. Dabei werden die `task_id` sowie die `created_at` automatisch von der Datenbank ausgefüllt (siehe query im Sourcecode).

Zugriffspunkte vom `node-client-server-extended` sind enthalten, aber in dieser Readme beschrieben: [- node-client-server-extended Beispiel ->](../node-client-server-extended/README.md)

Die `database.html` spielt dabei eine wichtige Rolle. In dieser Datei befindet sich `javascript` Code, welcher diese Anfragen stellt und auch in die HTML-Seite integriert (daher bitte die `database.html` anschauen).
Dabei gibt es auch ein Error-Handling, welches über den `alert` angezeigt wird. Jegliche Funktion wie löschen oder hinzufügen führt anschließend wieder das Laden der Datenbank aus, damit der neue Zustand gezeigt wird.

#### Datenbankverbindung

In dem Sourcecode wird die Datenbank automatisch vom `db`-Container beim Start initialisiert. Alternativ kann aber auch wie im `server.js` die Datenbank im Sourcecode angelegt werden (siehe auskommentierter Code am Anfang der Datei).

Bei dem Start von `server.js` wird die Verbindung zur Datenbank erstellt und auch getestet, damit diese später ohne Probleme vom Server verwendet werden kann.

**Hinweis:** Natürlich kann ein ConnectionPool verwendet werden. Dies kann man in der Dokumentation des `mysql`-clients in Node.js nachlesen.

**Hinweis:** In der Praxis muss man jegliche SQL-Query vor dem bekannten Angriff der `SQL-Injection` schützen. Dies sollte in der Vorlesung `IT-Sicherheit` erklärt werden.

### PhpMyAdmin

Im `docker-compose.yaml` wird auch ein `phpMyAdmin`-Container gestartet, der als Hilfestellung zum Erstellen, Testen sowie Debuggen der Datenbank dient. Dieser kann über:

`http://localhost:8085/`

erreicht werden. Hierbei muss man wie im `docker-compose.yaml` den Benutzernamen `MYSQL_USER` sowie das Passwort `MYSQL_PASSWORD` angeben. 

Dies kann auch für den Export verwendet werden mittels `Exportieren` -> `Schnell` -> `SQL`. Die daraus resultierende Datei kann dann in dem Ordner `db` als `database.sql` hinterlegt werden. Bei dem nächsten Neuerstellen des Datenbank-Containers wird diese dann automatisch geladen.

### Static Files

Alle statischen Dateien liegen wie bereits beschrieben in dem Ordner `public`, welcher über `/static/` per Webserver erreichbar ist. Am besten verwendet man relative Pfade zu den Dateien, so wie in der Datei `static.html`. Diese Datei befindet sich in `./server/public/static.html`.

In diesem Beispiel ist beschrieben, wie man Bilder und eigene CSS-Dateien referenzieren kann. Darüber hinaus können auch Javascript-Dateien so richtig ausgegliedert werden. Idealerweise überlegt man sich eine sinnvolle Ordnerstruktur, um dies auch gut warten zu können.

### Client

Der Client ist im Webbrowser, jedoch kann wie im `node-client-server-extended`-Beispiel [- node-client-server-extended Beispiel ->](../node-client-server-extended/README.md) ein eigener Client-Container angelegt werden, welcher die REST-Calls testet.

## Installation und lokale Ausführung

**Hinweis:** Beachte, dass die `docker-compose.yml` im Hauptverzeichnis des Projektes liegt. Die Ordnerstruktur enthält einen Ordner `client` und einen Ordner `server`, welche jeweils die benötigten Dateien sowie eine eigene `Dockerfile` haben, welche die Container beschreiben. Die Container sind unabhängig und unterscheiden sich. Innerhalb der `docker-compose.yml` wird unter `build` der Ordner angegeben, welcher die `Dockerfile` beinhaltet.

In den Verzeichnissen `server` können mittels:
```sh
npm install
```
alle definierten Bibliotheken im `package.js` heruntergeladen werden.


Mit folgenden Befehlen können der Server und Client lokal ausgeführt werden:

```sh
# start des servers -> im "server"-Ordner
node server.js
```

**Wichtig:** Die lokale Ausführung funktioniert nur, wenn alle notwendigen `Environmentvariablen` sowie die Datenbank erreichbar sind! Daher wird die Ausführung mittels `docker-compose` bei diesem Beispiel empfohlen!

## Ausführung mit Docker und docker-compose

In diesem Ordner können mit dem Terminal und folgendem Befehl:

```sh
# start mit
docker-compose up --build
```

automatisch der "Server"-Container und der "Client"-Container gestartet werden.
Darüber hinaus werden die beiden Container `server` und `client` mittels dem `--build` flag auch neu gebaut, damit aktuelle Änderungen enthalten sind.

Der Output sieht wie folgt aus:
```sh
Successfully built f34216b40a71
Successfully tagged node-client-server-extended-with-database_server:latest
Creating node-client-server-extended-with-database_meinecooledb_1 ... done
Creating node-client-server-extended-with-database_phpmyadmin_1   ... done
Creating node-client-server-extended-with-database_server_1       ... done
Attaching to node-client-server-extended-with-database_phpmyadmin_1, node-client-server-extended-with-database_meinecooledb_1, node-client-server-extended-with-database_server_1
meinecooledb_1  | 2020-04-10 13:38:44+00:00 [Note] [Entrypoint]: Entrypoint script for MySQL Server 1:10.4.12+maria~bionic started.
phpmyadmin_1    | phpMyAdmin not found in /var/www/html - copying now...
meinecooledb_1  | 2020-04-10 13:38:44+00:00 [Note] [Entrypoint]: Switching to dedicated user 'mysql'
meinecooledb_1  | 2020-04-10 13:38:44+00:00 [Note] [Entrypoint]: Entrypoint script for MySQL Server 1:10.4.12+maria~bionic started.
phpmyadmin_1    | Complete! phpMyAdmin has been successfully copied to /var/www/html
phpmyadmin_1    | AH00558: apache2: Could not reliably determine the server's fully qualified domain name, using 192.168.64.3. Set the 'ServerName' directive globally to suppress this message
phpmyadmin_1    | AH00558: apache2: Could not reliably determine the server's fully qualified domain name, using 192.168.64.3. Set the 'ServerName' directive globally to suppress this message
phpmyadmin_1    | [Fri Apr 10 13:38:44.905627 2020] [mpm_prefork:notice] [pid 1] AH00163: Apache/2.4.38 (Debian) PHP/7.4.4 configured -- resuming normal operations
phpmyadmin_1    | [Fri Apr 10 13:38:44.905683 2020] [core:notice] [pid 1] AH00094: Command line: 'apache2 -D FOREGROUND'
meinecooledb_1  | 2020-04-10 13:38:45+00:00 [Note] [Entrypoint]: Initializing database files
{...}
meinecooledb_1  | 2020-04-10 13:38:47+00:00 [Note] [Entrypoint]: Waiting for server startup
{...}
meinecooledb_1  | 2020-04-10 13:38:59+00:00 [Note] [Entrypoint]: /usr/local/bin/docker-entrypoint.sh: running /docker-entrypoint-initdb.d/database.sql
{...}
meinecooledb_1  | 2020-04-10 13:39:02 0 [Note] mysqld: ready for connections.
meinecooledb_1  | Version: '10.4.12-MariaDB-1:10.4.12+maria~bionic'  socket: '/var/run/mysqld/mysqld.sock'  port: 3306  mariadb.org binary distribution
server_1        | Conecting to database...
server_1        | Running on http://0.0.0.0:8080
server_1        | Database connected and works
```

Dabei wird auch im Log ausgegeben, wenn die `database.sql` geladen wird: `meinecooledb_1  | 2020-04-10 13:38:59+00:00 [Note] [Entrypoint]: /usr/local/bin/docker-entrypoint.sh: running /docker-entrypoint-initdb.d/database.sql`.

Um alle Container zu stoppen, können diese mittels [strg] + [c] beendet werden.

**Hinweis:** Sollte der Container nicht herunterfahren, dann kann [strg] + [c] nochmals gedrückt werden, um dies zu beschleunigen.

Der Output sieht wie folgt aus:
```sh
Gracefully stopping... (press Ctrl+C again to force)
Stopping node-client-server-extended-with-database_server_1       ...
Stopping node-client-server-extended-with-database_phpmyadmin_1   ...
Stopping node-client-server-extended-with-database_meinecooledb_1 ...
# wenn nochmal [strg] + [c] gedrückt wird:
Stopping node-client-server-extended-with-database_server_1       ... done
Stopping node-client-server-extended-with-database_phpmyadmin_1   ... done
Stopping node-client-server-extended-with-database_meinecooledb_1 ... done
```

**Wichtig:** Der Parameter `--build` sorgt dafür, dass bei jedem Aufruf von `docker-compose up` alle Container neu gebaut werden, damit alle Änderungen im `server.js` sowie im Datenbankschema `database.sql` in den jeweiligen Container integriert werden.


## Informationen

 * Express
   * NPM: https://www.npmjs.com/package/express
   * Dokumentation: https://expressjs.com/en/4x/api.html
   * Routing: https://expressjs.com/en/guide/routing.html
   * Getting Started: https://expressjs.com/en/starter/installing.html
 * MariaDB
   * Dockerhub: https://hub.docker.com/_/mariadb/
   * Homepage: https://mariadb.org/
   * Dokumentation: https://mariadb.org/documentation/
 * MySQL-Client
   * NPM: https://www.npmjs.com/package/mysql
   * Repository: https://github.com/mysqljs/mysql
 * Bootstrap (CSS für Table, usw.)
   * Homepage: https://getbootstrap.com/
   * Alerts: https://getbootstrap.com/docs/4.3/components/alerts/
   * Tabelle: https://getbootstrap.com/docs/4.0/content/tables/
   * Buttons: https://getbootstrap.com/docs/4.3/components/buttons/
 * W3Schools:
   * Button onclick Event: https://www.w3schools.com/jsref/event_onclick.asp
   * JSON HTML Table: https://www.w3schools.com/js/js_json_html.asp
   * AJAX: https://www.w3schools.com/xml/ajax_intro.asp
   * Node.js mysql: https://www.w3schools.com/nodejs/nodejs_mysql_where.asp
   * JSON: https://www.w3schools.com/js/js_json.asp
