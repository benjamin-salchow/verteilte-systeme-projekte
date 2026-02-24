# Client - Server mit Node.js TCP plain

## Allgemein

In diesem Beispiel wird ein Node.js-Server gestartet, welcher eine TCP/IP-Socketverbindung ermöglicht. Der Client verbindet sich gegen diesen Socket und schickt Nachrichten.

Für dieses Beispiel werden keine weiteren Bibliotheken verwendet. Es handelt sich um native Funktionen von Node.js.

### Server

Nach dem Start wird der TCP-Socket am Port 9233 geöffnet.

### Client

Nach dem Start des Clients wird eine Verbindung zum Server am Port 9233 gestartet und alle 3 Sekunden eine Nachricht geschickt.


## Installation und lokale Ausführung

Es müssen keine weiteren Pakete oder Bibliotheken installiert werden.

Mit folgenden Befehlen können der Server und der Client lokal ausgeführt werden:

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
Successfully built 7fc76cf6aea7
Successfully tagged node-plain-tcp_client:latest
Starting node-plain-tcp_server_1 ... done
Starting node-plain-tcp_client_1 ... done
Attaching to node-plain-tcp_server_1, node-plain-tcp_client_1
client_1  | Connected to packet feed
client_1  | Received: Hello there, client
client_1  | 
client_1  | send message to server...
server_1  | Received: Hello, super server! Love, Client.
server_1  | Answer to client...
client_1  | Received: Hello back
```

Um beide Container zu stoppen, können diese mittels [Strg] + [c] beendet werden.

**Hinweis:** Sollte der Container nicht herunterfahren, dann kann [Strg] + [c] nochmals gedrückt werden, um dies zu beschleunigen.

Der Output sieht wie folgt aus:
```sh
Gracefully stopping... (press Ctrl+C again to force)
Stopping node-plain-tcp_client_1 ... done
Stopping node-plain-tcp_server_1 ... 
# wenn nochmal [Strg] + [c] gedrückt wird:
Stopping node-plain-tcp_server_1 ... done
```

**Wichtig:** Der Parameter `--build` sorgt dafür, dass bei jedem Aufruf von `docker-compose up` der Container neu gebaut wird. damit alle Änderungen im `client.js` sowie im `server.js` im Container integriert sind.


## Informationen

 * net
   * Dokumentation: https://nodejs.org/api/net.html
 * Eigenes Protokoll
   * Medium: https://medium.com/@nikolaystoykov/build-custom-protocol-on-top-of-tcp-with-node-js-part-1-fda507d5a262
