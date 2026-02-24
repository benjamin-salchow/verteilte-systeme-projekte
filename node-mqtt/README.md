# Message Oriented mit MQTT und Node.js

**Hinweis:** Bitte zuerst die anderen Beispiele anschauen.


## Allgemein

In diesem Beispiel wird ein MQTT-Server (mosquitto) im Container gestartet und eine beliebige Anzahl von nodes, welche den MQTT-Server verwenden.

### Server MQTT

Eclipse Mosquitto (MQTT) ist ein OpenSource Message Broker, der vor allem im IOT-Bereich verwendet wird.

Der Server wird mit der Standardkonfiguration gestartet und öffnet Port 1883 TCP/IP.

### Clients

Der Client `node.js` verbindet sich mit dem MQTT-Server und schickt zwischen 2 bis 5 Sekunden (zufällig) folgende Nachricht:

```js
// topic:
mytopic

// message:
'My message: ' + Math.random() + ' - from node:' + HOSTNAME

// JavaScript Code:
client.publish('mytopic', 'My message: ' + Math.random() + ' - from node:' + HOSTNAME)
```

## Installation und lokale Ausführung

In diesem Verzeichnis können mittels:
```sh
npm install
```
alle definierten Bibliotheken in der `package.json` heruntergeladen und installiert werden.


Mit folgenden Befehlen kann der Client lokal ausgeführt werden:

```sh
# start des clients
node node.js
```

**Wichtig:** Der Server kann lokal installiert werden, jedoch ist die Ausführung mit `docker-compose` einfacher und sollte bevorzugt werden.

## Ausführung mit Docker und docker-compose

In diesem Ordner können mit dem Terminal und folgendem Befehl:

```sh
# start mit
docker-compose up --scale node=3 --build --remove-orphans
```

automatisch der "Server"-Container (MQTT) und die "Client"-Containers (3 Instanzen) gestartet werden.

Der Output sieht wie folgt aus:
```sh
Successfully built b0351966522b
Successfully tagged node-mqtt_node:latest
Starting node-mqtt_mqttserver_1 ... done
Stopping and removing node-mqtt_node_4  ... done
Stopping and removing node-mqtt_node_5  ... done
Stopping and removing node-mqtt_node_6  ... done
Stopping and removing node-mqtt_node_7  ... done
Stopping and removing node-mqtt_node_8  ... done
Stopping and removing node-mqtt_node_9  ... done
Stopping and removing node-mqtt_node_10 ... done
Stopping and removing node-mqtt_node_11 ... done
Stopping and removing node-mqtt_node_12 ... done
Stopping and removing node-mqtt_node_13 ... done
Starting node-mqtt_node_1               ... done
Starting node-mqtt_node_2               ... done
Starting node-mqtt_node_3               ... done
Attaching to node-mqtt_mqttserver_1, node-mqtt_node_1, node-mqtt_node_2, node-mqtt_node_3
mqttserver_1  | 1584300841: mosquitto version 1.6.9 starting
mqttserver_1  | 1584300841: Config loaded from /mosquitto/config/mosquitto.conf.
mqttserver_1  | 1584300841: Opening ipv4 listen socket on port 1883.
mqttserver_1  | 1584300841: Opening ipv6 listen socket on port 1883.
node_1        | Starting Node: node - hostname:b9ecb8efff12
mqttserver_1  | 1584300842: New connection from 172.20.0.3 on port 1883.
mqttserver_1  | 1584300842: New client connected from 172.20.0.3 as mqttjs_8617544d (p2, c1, k60).
node_1        | Received:Hello mqtt from Node:b9ecb8efff12
node_3        | Starting Node: node - hostname:cfc439cd363f
mqttserver_1  | 1584300842: New connection from 172.20.0.4 on port 1883.
mqttserver_1  | 1584300842: New client connected from 172.20.0.4 as mqttjs_9e4c7431 (p2, c1, k60).
node_1        | Received:Hello mqtt from Node:cfc439cd363f
node_3        | Received:Hello mqtt from Node:cfc439cd363f
node_2        | Starting Node: node - hostname:5df38ebc8279
mqttserver_1  | 1584300842: New connection from 172.20.0.5 on port 1883.
mqttserver_1  | 1584300842: New client connected from 172.20.0.5 as mqttjs_4f37e88c (p2, c1, k60).
node_3        | Received:Hello mqtt from Node:5df38ebc8279
node_2        | Received:Hello mqtt from Node:5df38ebc8279
node_1        | Received:Hello mqtt from Node:5df38ebc8279
```

Um beide Container zu stoppen, können diese mittels [Strg] + [c] beendet werden.

**Hinweis:** Sollte der Container nicht herunterfahren, dann kann [Strg] + [c] nochmals gedrückt werden, um dies zu beschleunigen.

Der Output sieht wie folgt aus:
```sh
Gracefully stopping... (press Ctrl+C again to force)
Stopping node-mqtt_node_1               ... done
Stopping node-mqtt_node_3               ... done
Stopping node-mqtt_node_2               ... done
Stopping node-mqtt_mqttserver_1         ... done
```

**Wichtig:** Der Parameter `--build` sorgt dafür, dass bei jedem Aufruf von `docker-compose up` der Container neu gebaut wird, damit alle Änderungen im `node.js` integriert werden.

**Wichtig:** Der Parameter `--scale node=3` sorgt dafür, dass 3 Knoten angelegt werden. Es kann eine beliebige Zahl eingetragen werden.

**Wichtig:** Der Parameter `--remove-orphans` sorgt dafür, dass nicht mehr benötigte Container (beim Verwenden von `--scale node=3`) automatisch gelöscht werden.

## Informationen

 * MQTT-Server
   * Webseite: https://mosquitto.org/
   * Docker Hub: https://hub.docker.com/_/eclipse-mosquitto/

 * MQTT-Client
   * NPM: https://www.npmjs.com/package/mqtt
   * Beispiel: https://www.npmjs.com/package/mqtt#example
   * Repository Beispiele: https://github.com/mqttjs/MQTT.js/tree/master/examples/client
