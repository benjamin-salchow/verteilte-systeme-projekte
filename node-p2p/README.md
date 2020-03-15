# Peer2Peer-Beispiel mit Node.js

**Hinweis:** Bitte zuerst die anderen Beispiele anschauen.

**Wichtig:** Das `docker-compose.yaml` File muss noch erstellt werden! Dieses Beispiel läuft noch nicht im Container - nur lokal!

## Allgemein

Dieses Beispiel verwendet die `js-libp2p`, welches ein Peer2Peer-Protokoll implementiert.

Es basiert auf: https://github.com/libp2p/js-libp2p/tree/master/examples/transports, welches einen guten Startpunkt bereitstellt.

## Installation und lokale Ausführung

In diesem Verzeichnis können mittels:
```sh
npm install
```
alle definierten Bibliotheken im `package.js` heruntergeladen werden.


Mit folgenden Befehlen können der Server und der Client lokal ausgeführt werden:

```sh
# start
node index.js
```


## Informationen

 * libp2p
   * Webseite: https://libp2p.io/
   * Dokumentation: https://docs.libp2p.io/
   * Beispiel: https://github.com/libp2p/js-libp2p/tree/master/examples/transports
   * Weitere Beispiele: https://github.com/libp2p/js-libp2p/tree/master/examples