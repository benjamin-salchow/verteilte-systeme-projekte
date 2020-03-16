# Client - Webserver mit Java Spring-Boot

## Allgemein

In diesem Beispiel werden ein Java Webserver (mittels Spring-Boot) gestartet und Zugriffspunkte (Pfäde) definiert.

**Hinweis:** Aufgrund der Komplexität von Java-Projekten könnte ein Node.js Projekt einfacher sein. Dies dient als schneller Startpunkt, um bekanntes Web-Framework für Java zu verwenden. Alternativ ist Java EE (z.B. Tomcat) möglich. Jedoch ist dessen Aufbau weitaus komplexer als Spring-Boot.

### Server

Nach dem Start des Servers werden folgende Pfade (Zurgriffspunkte) bereitgestellt:

 * GET http://localhost:8080/
   * Allgemeiner Einstiegspunkt
 * GET http://localhost:8080/special_path
   * Alternativer Pfad, der getrennt behandelt wird


### Client

Der Client ist noch nicht implementiert, kann jedoch einfach als eigener Container implementiert werden.


## Installation und lokale Ausführung

In diesem Verzeichnis kann mittels:
```sh
./gradlew build && java -jar build/libs/gs-spring-boot-docker-0.1.0.jar
```
automatisch der Server gebaut und anschließend der Webserver gestartet werden.


## Ausführung mit Docker und docker-compose

In diesem Ordner kann mit dem Terminal und folgendem Befehl:

```sh
# Unbedingt zuerst die Anwendung bauen
./gradlew build
# start mit
docker-compose up --build
```

automatisch der "Server"-Container  gestartet werden.

Der Output sieht wie folgt aus:
```sh
todo
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

**Wichtig:** Der Parameter `--build` sorgt dafür, dass bei jedem Aufruf von `docker-compose up` der Container neu gebaut wird. Jedoch muss die Java-Anwendung mittels `./gradlew build` gebaut werden.

## Sourcecode

Da Java-Projekte eine komplexere Struktur haben, findet man den Source Code in:
`src/main/java/hello/Application.java`. Darin können weitere Einstiegspunkte definiert werden.

Zu beachten ist, dass Spring `gradle` sowie `mvn` (Maven) als Build-Tool unterstützen. Diese werden benötigt, um den eigentlichen Quelltext zu bauen, der dann später in den Container eingefügt wird.

Die `pom.xml`-Datei beschreibt, welche Abhängigkeiten das Projekt hat. Sollte man weitere Libraries für das Projekt benötigen, können diese hier hinzugefügt werden.

## Informationen

 * Spring Boot
   * Dokumentation: https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/
   * Getting Started: https://spring.io/guides/gs/spring-boot/
   * Spring Boot Tutorial: https://spring.io/guides/gs/spring-boot/#initial
   * Spring Boot Docker: https://spring.io/guides/gs/spring-boot-docker/
   * Spring Gudies: https://spring.io/guides
  


