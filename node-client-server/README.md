# Client - (Web-)Server mit Node.js

## Allgemein

In diesem Beispiel wird ein Node.js Webserver (mittels Express) gestartet und Zugriffspunkte (Pfäde) definiert. Der Client macht eine Anfrage an den Server alle 3 Sekunden.

### Server

Nach dem Start des Servers werden folgende Pfade (Zurgriffspunkte) bereitgestellt:

 * GET http://localhost:8080/
   * Allgemeiner Einstiegspunkt
 * GET http://localhost:8080/special_path
   * Alternativer Pfad, der getrennt behandelt wird
 * GET http://localhost:8080/request_info
   * Anzeige der Request Information, die verwendet werden kann
 * POST http://localhost:8080/client_post
   * An diesem Pfad wird mittels Post ein JSON übermittelt, welches "post_content" beinhaltet
   * Diese wird vom `client.js` verwendet
 * GET http://localhost:8080/static
   * Jeglicher Zugriff wird auf den "public" Ordner geleitet
   * Dieser beinhaltet eine `index.html`-Datei, welche angezeigt wird
   * Dies kann verwendet werden, um statische Dateien (z.B. Client-Skripte, Bilder usw.) zu verteilen

### Client

Nach dem Start des Clients wird alle 3 Sekunden ein Request (Anfrage) gegen http://localhost:8080/client_post geschickt. Als Inhalt wird "post_content"  mit folgendem Inhalt versendet:
```js
'Random Number: ' + Math.random()
```
## Installation und lokale Ausführung

In diesem Verzeichnis können mittels:
```sh
npm install
```
alle definierten Bibliotheken im `package.js` heruntergeladen werden.


Mit folgenden Befehlen können der Server und Client lokal ausgeführt werden:

```sh
# start des servers
node server.js

# start des clients (im anderen Terminal)
node client.js
```

## Ausführung mit Docker und docker-compose

In diesem Ordner können mit dem Terminal und folgendem Befehl:

```sh
# start mit
docker-compose up --build
```

automatisch der "Server"-Container und der "Client"-Container gestartet werden.

Der Output sieht wie folgt aus:
```sh
Successfully built 0b6186de9b19
Successfully tagged node-client-server_client:latest
Creating node-client-server_server_1 ... done
Creating node-client-server_client_1 ... done
Attaching to node-client-server_server_1, node-client-server_client_1
server_1  | Running on http://0.0.0.0:8080
server_1  | Client send 'post_content' with content: Random Number: 0.15673919283715887
client_1  | statusCode: 200
client_1  | { message: 'I got your message: Random Number: 0.15673919283715887' }
server_1  | Client send 'post_content' with content: Random Number: 0.27480495317140186
client_1  | statusCode: 200
client_1  | { message: 'I got your message: Random Number: 0.27480495317140186' }
server_1  | Client send 'post_content' with content: Random Number: 0.27105842745517816
client_1  | statusCode: 200
client_1  | { message: 'I got your message: Random Number: 0.27105842745517816' }
```

Um beide Container zu stoppen, können diese mittels [strg] + [c] beendet werden.

**Hinweis:** Sollte der Container nicht herunterfahren, dann kann [strg] + [c] nochmals gedrückt werden, um dies zu beschleunigen.

Der Output sieht wie folgt aus:
```sh
Gracefully stopping... (press Ctrl+C again to force)
Stopping node-client-server_client_1 ... 
Stopping node-client-server_server_1 ... 
# wenn nochmal [strg] + [c] gedrückt wird:
Killing node-client-server_client_1  ... done
Killing node-client-server_server_1  ... done
```

**Wichtig:** der Parameter `--build` sorgt dafür, dass bei jedem Aufruf von `docker-compose up` der Container neu gebaut wird, damit alle Änderungen im `client.js` sowie im `server.js` im Container integriert sind.


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