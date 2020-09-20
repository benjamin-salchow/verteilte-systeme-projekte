# Peer2Peer-Beispiel mit Node.js

**Hinweis:** Bitte zuerst die anderen Beispiele anschauen.

## Allgemein

Dieses Beispiel verwendet die `PeerJS` Library (https://peerjs.com/), welches ein Peer2Peer-Protokoll über Web-RTC implementiert.

Es basiert grundlegend auf: https://github.com/jmcker/Peer-to-Peer-Cue-System, welches einen guten Startpunkt bereitstellt.

## Verwendung

Nach dem Start der Anwendung sollte man zuerst mit einem Web-Browser folgende URL aufrufen:
  * http://localhost:8080/
Auf dieser Seite ist der Startpunkt (`index.html`), welche Links zu dem Receiver und Sender beinhalten.
Mit einem Klick auf den Link wird ein neues Fenster geöffnet.

Zuerst sollte man den Receiver öffnen:
  * http://localhost:8080/static/receive.html
Danach sollte man eine Webseite sehen, welche eine ID angibt. Diese ID ist das eigenständige Browserfenster und eine eigenständige Node.
Diese kann per Peer2Peer über Web-RTC separat angesprochen werden.

Nun öffnen wir ein weiteres Web-Browser Fenster mit folgender URL:
 * http://0.0.0.0:8080/static/send.html
In diesem Fenster können wir nun oben die ID eingeben, welche wir bei dem Receiver gesehen haben.
Die ID basiert auf einer UUID und sieht z.B. so aus: `023c0004-700f-4392-8d1e-399faec8ad2e`.
Danach auf `connect` clicken und nun sollten die beiden Browser miteinander per peer2peer kommunizieren können.

Zu beachten ist, dass der Server verwendet wird, um IDs zu generieren und um initial eine Schnittstelle zu haben, um andere Peers finden zu können.
Nachdem eine Node sich mit einer anderen Node verbunden hat, läuft die Kommunikation über Web-RTC peer2peer ab.
Dabei gibt es auch die Möglichkeit eines Relais, eines Turn-Servers und anderer Techniken. Diese können hier nachgelesen werden:
 * https://webrtc.org/
 * https://webrtc.org/getting-started/peer-connections
 * https://webrtc.org/getting-started/turn-server

**Hinweis:** Der ID-Generator läuft auf dem Server und kann unter http://localhost:8080/peerjs/myapp/peerjs/id direkt angesteuert werden. Es ist möglich, den ID-Generator selbst zu schreiben.

**Hinweis:** Zum Testen, ob der PeerJS-Server richtig läuft, kann man unter http://localhost:8080/peerjs/myapp/ schauen, ob ein JSON mit den PeerJS-Informationen angezeigt wird.


## Installation und lokale Ausführung

In diesem Verzeichnis können mittels:
```sh
npm install
```
alle definierten Bibliotheken im `package.js` heruntergeladen werden.


Mit folgenden Befehlen kann der Server lokal ausgeführt werden:

```sh
# start
node index.js
```

## Ausführung mit Docker und docker-compose

In diesem Ordner kann mit dem Terminal und folgendem Befehl:

```sh
# start mit
docker-compose up --build
```

automatisch der "Server"-Container gestartet werden.
Darüber hinaus wird der Container `server` mittels dem `--build` flag auch neu gebaut, damit aktuelle Änderungen enthalten sind.

Der Output sieht wie folgt aus:
```sh
Building server
Step 1/7 : FROM node:alpine
 ---> b01d82bd42de
Step 2/7 : WORKDIR /usr/src/app
 ---> Using cache
 ---> b40e49364aca
Step 3/7 : COPY package*.json ./
 ---> Using cache
 ---> cc941b002224
Step 4/7 : RUN npm install
 ---> Using cache
 ---> ab3b1e9ee420
Step 5/7 : COPY . .
 ---> e1bf2d0f69c7
Step 6/7 : EXPOSE 8080
 ---> Running in f7b072fd3fd9
Removing intermediate container f7b072fd3fd9
 ---> df4cdf6979c0
Step 7/7 : CMD [ "node", "index.js" ]
 ---> Running in 41efc67ae22e
Removing intermediate container 41efc67ae22e
 ---> b8c8aa65ea27
Successfully built b8c8aa65ea27
Successfully tagged node-p2p_server:latest
Recreating node-p2p_server_1 ... done
Attaching to node-p2p_server_1
server_1  | Running on http://0.0.0.0:8080
server_1  | Open the following URL with your Browser: http://localhost:8080/
```

Um beide Container zu stoppen, können diese mittels [strg] + [c] beendet werden.

**Hinweis:** Sollte der Container nicht herunterfahren, dann kann [strg] + [c] nochmals gedrückt werden, um dies zu beschleunigen.

Der Output sieht wie folgt aus:
```sh
Gracefully stopping... (press Ctrl+C again to force)
Stopping node-p2p_server_1   ... 
# wenn nochmal [strg] + [c] gedrückt wird:
Stopping node-p2p_server_1 ... done
```

**Wichtig:** Der Parameter `--build` sorgt dafür, dass bei jedem Aufruf von `docker-compose up` der` server` Container neu gebaut wird, damit alle Änderungen in der `index.js` im Container integriert werden.

**Hinweis:** Security checks im Firefox könnten bei Web-RTC und ICE Probleme bereiten bei einer Ausführung im Container!

## Informationen

 * ipfs
   * Webseite: https://peerjs.com/
   * Dokumentation: https://peerjs.com/docs.html#api
   * Server: https://github.com/peers/peerjs-server
   * Node / Client: https://github.com/peers/peerjs

