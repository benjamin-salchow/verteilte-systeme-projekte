# Client - (Web-)Server Extendet mit Node.js

## Allgemein

In diesem Beispiel wird ein Node.js Webserver (mittels Express) gestartet und Zugriffspunkte (Pfäde) definiert. Der Client macht eine Anfrage an den Server alle 3 Sekunden.

Im Vergleich zum normalen Node.js Client - (Web-)Server Beispiel laufen der Client und der Server in zwei getrennten Containern, die auch verschiedene `Dockerfile`s benutzen. Das bedeutet, dass der Client-Container nur den Client beinhaltet und der Server nur alle Dateien, die für den Server notwendig sind.

Darüber hinaus beinhaltet die Webseite in `server/public/index.html` zwei Beispiele, wie man über eine Webseite den Server aufrufen kann. Jeder Aufruf im Ordner `public` wird über `https://localhost:8080/static/` + `<Dateiname>` an den Client übertragen. Da `index.html` immer aufgerufen wird, wenn kein Dateiname angegeben ist, mus dies nicht explizit angegeben werden.

### Server

Nach dem Start des Servers werden folgende Pfade (Zurgriffspunkte) bereitgestellt:

Zugriffspunkte, die sich geändert haben:
 * GET http://localhost:8080/
   * Allgemeiner Einstiegspunkt, der automatisch den Client zu http://localhost:8080/static weiterleitet.
 * POST http://localhost:8080/button1_name
   * Button 1 Beispiel von der static Webseite - `server/public/index.html`.
   * Der Name im Formular wird an den Server geschickt und in diesem Beispiel wieder zurück zu dem Client in einem JSON.
   * Weitere Informationen: https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/forms
 * GET http://localhost:8080/button2
   * Button 2 Beispiel von der static Webseite - `server/public/index.html`.
   * Diese wird durch AJAX automatisch in der aktuellen Seite eingebunden und angezeigt.
   * Weitere Informationen: https://www.w3schools.com/xml/ajax_intro.asp

Zugriffspunkte vom alten Beispiel - immer noch enthalten:
 * GET http://localhost:8080/special_path
   * Alternativer Pfad, der getrennt behandelt wird
 * GET http://localhost:8080/request_info
   * Anzeige der Request Information, die verwendet werden kann
 * POST http://localhost:8080/client_post
   * An diesem Pfad wird mittels Post ein JSON übermittelt, welches "post_content" beinhaltet
   * Diese wird vom `client.js` verwendet
 * GET http://localhost:8080/static
   * Jeglicher Zugriff wird auf den "public"-Ordner geleitet
   * Dieser beinhaltet eine `index.html`-Datei, welche angezeigt wird
   * Dies kann verwendet werden, um statische Dateien (z.B. Client-Skripte, Bilder usw.) zu verteilen

### Client

Der Client ist nun ein eigener Container, der getrennt gebaut wird. In diesem Container sind nur die clientspezifischen Inhalte enthalten. Ansonsten unterscheidet sich der Client nicht von dem normalen Beispiel.

Nach dem Start des Clients wird alle 3 Sekunden ein Request (Anfrage) gegen http://localhost:8080/client_post geschickt. Als Inhalt wird "post_content"  mit folgendem Inhalt versendet:
```js
'Random Number: ' + Math.random()
```
## Installation und lokale Ausführung

**Hinweis:** Beachte, dass die `docker-compose.yml` im Hauptverzeichnis des Projektes liegt. Die Ordnerstruktur enthält einen Ordner `client` und einen Ordner `server`, welche jeweils die benötigten Dateien sowie eine eigene `Dockerfile` haben, welche die Container beschreiben. Die Container sind unabhängig und unterscheiden sich. Innerhalb der `docker-compose.yml` wird unter `build` der Ordner angegeben, welche die `Dockerfile` beinhaltet.

In den Verzeichnissen `server` und `client` können mittels:
```sh
npm install
```
alle definierten Bibliotheken im `package.js` heruntergeladen werden.


Mit folgenden Befehlen können der Server und Client lokal ausgeführt werden:

```sh
# start des servers -> im "server"-Ordner
node server.js

# start des clients (im anderen Terminal) -> im "client"-Ordner
node client.js
```

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
Successfully built e917e4eb5191
Successfully tagged node-client-server-extendet_client:latest
Creating node-client-server-extendet_server_1 ... done
Creating node-client-server-extendet_client_1 ... done
Attaching to node-client-server-extendet_server_1, node-client-server-extendet_client_1
server_1  | Running on http://0.0.0.0:8080
server_1  | Client send 'post_content' with content: Random Number: 0.4803556287641142
client_1  | statusCode: 200
client_1  | { message: 'I got your message: Random Number: 0.4803556287641142' }
server_1  | Client send 'post_content' with content: Random Number: 0.1115857723446132
client_1  | statusCode: 200
client_1  | { message: 'I got your message: Random Number: 0.1115857723446132' }
```

Um beide Container zu stoppen, können diese mittels [strg] + [c] beendet werden.

**Hinweis:** Sollte der Container nicht herunterfahren, dann kann [strg] + [c] nochmals gedrückt werden, um dies zu beschleunigen.

Der Output sieht wie folgt aus:
```sh
Gracefully stopping... (press Ctrl+C again to force)
Stopping node-client-server-extendet_client_1 ... 
Stopping node-client-server-extendet_server_1 ... 
# wenn nochmal [strg] + [c] gedrückt wird:
Stopping node-client-server-extendet_client_1 ... done
Stopping node-client-server-extendet_server_1 ... done
```

**Wichtig:** Der Parameter `--build` sorgt dafür, dass bei jedem Aufruf von `docker-compose up` die beiden Container `client` und `server` neu gebaut werden, damit alle Änderungen im `client.js` sowie im `server.js` in den jeweiligen Container integriert werden.


## Informationen

 * Express
   * NPM: https://www.npmjs.com/package/express
   * Dokumentation: https://expressjs.com/en/4x/api.html
   * Routing: https://expressjs.com/en/guide/routing.html
   * Getting Started: https://expressjs.com/en/starter/installing.html
 * Axios
   * NPM: https://www.npmjs.com/package/axios
   * Beispiel: https://www.npmjs.com/package/axios#example
   * Repository: https://github.com/axios/axios