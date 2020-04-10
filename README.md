# Beispiele für die Projektarbeit

## Allgemein

In diesem Verzeichnis sind alle Beispiele, die als Grundlage oder Inspiration für die Projektarbeit verwendet werden können.

Beispiele in Node.js sowie Java sind hier. Allternativ können auch andere Frameworks und auch Programmiersprachen verwendet werden (nach Absprache!).

## Beispiele

### Node.js

#### Allgemeine Informationen

Für die Entwicklung von PoCs (Proof of Concepts) ist Node.js eine sehr beliebte Programmier-(Skript)sprache, da schnell Anwendungen damit entwickelt werden können. Da JavaScript JSON direkt verwendet, ist die Serialisierung mit Webdiensten, die JSON unterstützen, sehr angenehm zu programmieren.

Im Folgenden sind einige interessante Links, die beim Entwickeln helfen können:

 * W3School
   * Sehr gutes Nachschlagewerk für den Einstieg
   * JavaScript allgemein (browserspezifisch grundlegend auch für Node.js): https://www.w3schools.com/js/default.asp
   * JSON: https://www.w3schools.com/js/js_json.asp
   * Node.js: https://www.w3schools.com/nodejs/

**Hinweis:** JavaScript im Browser unterscheidet sich von den Bibliotheken und von den Möglichkeiten im Vergleich zu Node.js. Grundlegende Grammatik sowie Funktionen sind in beiden zum größten Teil gleich. Ausnahmen fallen in der Regel schnell auf und werden sehr gut im Internet erklärt.

##### Pakete bzw. Bibliotheken installieren

Wenn man in Node.js weitere Pakete installieren möchte, kann dies mit dem Node.js Paketmanager `npm` erledigt werden. Es stehen eine Vielzahl an fertigen Paketen bereit, die für das Projekt verwendet werden können.

Pakete können unter der Webseite: https://www.npmjs.com/ gesucht werden. Diese beinhalten in der Regel eine Dokumentation und Beispiele, die bei der Integration in das Projekt helfen.

Installiert werden die Pakete im Verzeichnis des Projektes mittels `npm install <paketname> --save`, wobei der `<paketname>` dementsprechend eingesetzt werden muss. Das `--save` sorgt dafür, dass das Paket auch richtig in die `package.json` sowie `package-lock.json` geschrieben wird, welche bei dem Bau des Containers verwendet wird.

#### Client-Server plain TCP

Einfaches Beispiel auf TCP-Basis.

[- Link Anleitung ->](node-plain-tcp/README.md)

[- Link Ordner->](node-plain-tcp/)


#### Client-Server Webserver

Einfacher Webserver (HTTP) mit Client.

[- Link Anleitung ->](node-client-server/README.md)

[- Link Ordner->](node-client-server/)

#### Message Oriented MQTT

Einfaches Beispiel mit einem MQTT-Server auf Mosquitto Basis und einem Node.js Client.

[- Link Anleitung ->](node-mqtt/README.md)

[- Link Ordner->](node-mqtt/)

#### Peer2Peer

Beispiel mit einer Peer2Peer-Bibliothek.

[- Link Anleitung ->](node-p2p/README.md)

[- Link Ordner->](node-p2p/)

#### Client-Server Webserver - Extendet

Einfacher Webserver (HTTP) mit Client, in dem zwei getrennte Container `client` sowie `server` gebaut werden. Darüber hinaus werden in der statischen Datei `index.html` unter `server/public` zwei Beispiele gezeigt, wie eine Client-Server-Aktion über den Browser ermöglicht werden kann mittels Formulare oder AJAX.

[- Link Anleitung ->](node-client-server-extendet/README.md)

[- Link Ordner->](node-client-server-extendet/)

#### Client-Server Webserver - Extendet mit Datenbank

Erweiterung des `Client-Server Webserver - Extendet`-Beispiels mit einer SQL-Datenbank. Verwaltung der Datenbank erfolgt mit dem Browser und AJAX.

[- Link Anleitung ->](node-client-server-extendet-with-database/README.md)

[- Link Ordner->](node-client-server-extendet-with-database/)

### Java

#### Allgemeine Informationen

##### Pakete bzw. Bibliotheken installieren

Wenn man in Java weitere Pakete bzw. Bibliotheken installieren möchte, werden diese in der Buildkonfiguration von Gradle definiert: `build.gradle` bei `dependencies` z.B.:
```gradle
dependencies {
    compile("org.springframework.boot:spring-boot-starter-web") 
    testCompile("org.springframework.boot:spring-boot-starter-test")
    // https://mvnrepository.com/artifact/org.eclipse.paho/org.eclipse.paho.client.mqttv3
    compile group: 'org.eclipse.paho', name: 'org.eclipse.paho.client.mqttv3', version: '1.2.2'
}
```
Alternativ kann man in Java auch Maven benutzen. Hier heißt die Konfigurationsdatei `pom.xml`. Dabei wird im `dependencies`-Block z.B. folgendes eingefügt:
```xml
<!-- https://mvnrepository.com/artifact/org.eclipse.paho/org.eclipse.paho.client.mqttv3 -->
<dependency>
    <groupId>org.eclipse.paho</groupId>
    <artifactId>org.eclipse.paho.client.mqttv3</artifactId>
    <version>1.2.2</version>
</dependency>
```

Die Pakete kann man z.B. im Maven Repository unter https://mvnrepository.com/ suchen und dort gibt es auch für Gradle und Maven (mvn) bereits eine Übersicht der Zeilen, die man wie oben beschrieben in die richtige Konfigurationsdatei einfügen muss.

#### Client-Server Webserver

Einfacher Webserver (HTTP).

[- Link Anleitung ->](java-spring-server-client-docker/README.md)

[- Link Ordner->](java-spring-server-client-docker/)

#### Message Oriented MQTT

Einfaches Beispiel mit einem MQTT-Server auf Mosquitto Basis und einer Java Spring Node.

[- Link Anleitung ->](java-spring-mqtt/README.md)

[- Link Ordner->](java-spring-mqtt/)

**Hinweis:** Ein Java-Beispiel hat noch keinen Client, daher muss dieser noch implementiert werden.