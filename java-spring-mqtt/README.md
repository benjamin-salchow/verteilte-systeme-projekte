# Message Oriented mit MQTT und Java Spring-Boot

## Allgemein

In diesem Beispiel werden ein Java Webserver (mittels Spring-Boot) gestartet sowie ein MQTT-Server (mosquitto) im Container.

**Hinweis:** Aufgrund der Komplexität von Java-Projekten könnte ein Node.js Projekt einfacher sein. Dies dient als schneller Startpunkt, um bekanntes Web-Framework für Java zu verwenden. Alternativ ist Java EE (z.B. Tomcat) möglich. Jedoch ist dessen Aufbau weitaus komplexer als Spring-Boot.

### Server MQTT

Eclipse Mosquitto (MQTT) ist ein OpenSource Message Broker, der vor allem im IOT-Bereich verwendet wird.

Der Server wird mit der Standardkonfiguration gestartet und öffnet Port 1883 TCP/IP.

### Node mit Webserver

Der Node startet einen Thread und verbindet sich mit den MQTT Server.

Darüber hinaus werden noch Pfade (Zugriffspunkte) bereitgestellt:

 * GET http://localhost:8080/
   * Allgemeiner Einstiegspunkt
 * GET http://localhost:8080/special_path
   * Alternativer Pfad, der getrennt behandelt wird



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
mqttserver_1  | 1585769715: mosquitto version 1.6.9 starting
mqttserver_1  | 1585769715: Config loaded from /mosquitto/config/mosquitto.conf.
mqttserver_1  | 1585769715: Opening ipv4 listen socket on port 1883.
mqttserver_1  | 1585769715: Opening ipv6 listen socket on port 1883.
node_1        | Thread Running
node_1        | Connecting to broker: tcp://mqttserver
mqttserver_1  | 1585769715: New connection from 172.23.0.3 on port 1883.
mqttserver_1  | 1585769716: New client connected from 172.23.0.3 as JavaSample (p2, c1, k60).
node_1        | Connected
node_1        | Publishing message: My message:
node_1        | Message published
node_1        | test
node_1        | Publishing message: My message:34
node_1        | 
node_1        |   .   ____          _            __ _ _
node_1        |  /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
node_1        | ( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
node_1        |  \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
node_1        |   '  |____| .__|_| |_|_| |_\__, | / / / /
node_1        |  =========|_|==============|___/=/_/_/_/
node_1        |  :: Spring Boot ::        (v2.2.1.RELEASE)
node_1        | 
node_1        | 2020-04-01 19:35:16.578  INFO 1 --- [           main] hello.Application                        : Starting Application on 5ea279759af9 with PID 1 (/app.jar started by spring in /)
node_1        | 2020-04-01 19:35:16.583  INFO 1 --- [           main] hello.Application                        : No active profile set, falling back to default profiles: default
node_1        | 2020-04-01 19:35:17.669  INFO 1 --- [           main] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat initialized with port(s): 8080 (http)
node_1        | 2020-04-01 19:35:17.684  INFO 1 --- [           main] o.apache.catalina.core.StandardService   : Starting service [Tomcat]
node_1        | 2020-04-01 19:35:17.685  INFO 1 --- [           main] org.apache.catalina.core.StandardEngine  : Starting Servlet engine: [Apache Tomcat/9.0.27]
node_1        | 2020-04-01 19:35:17.747  INFO 1 --- [           main] o.a.c.c.C.[Tomcat].[localhost].[/]       : Initializing Spring embedded WebApplicationContext
node_1        | 2020-04-01 19:35:17.748  INFO 1 --- [           main] o.s.web.context.ContextLoader            : Root WebApplicationContext: initialization completed in 1099 ms
node_1        | 2020-04-01 19:35:17.932  INFO 1 --- [           main] o.s.s.concurrent.ThreadPoolTaskExecutor  : Initializing ExecutorService 'applicationTaskExecutor'
node_1        | 2020-04-01 19:35:18.092  INFO 1 --- [           main] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat started on port(s): 8080 (http) with context path ''
node_1        | 2020-04-01 19:35:18.095  INFO 1 --- [           main] hello.Application                        : Started Application in 1.972 seconds (JVM running for 2.436)
node_1        | Publishing message: My message:19
node_1        | Publishing message: My message:3
node_1        | Publishing message: My message:33

```

Um beide Container zu stoppen, können diese mittels [Strg] + [c] beendet werden.

**Hinweis:** Sollte der Container nicht herunterfahren, dann kann [Strg] + [c] nochmals gedrückt werden, um dies zu beschleunigen.

Der Output sieht wie folgt aus:
```sh
Gracefully stopping... (press Ctrl+C again to force)
Stopping java-spring-mqtt_node_1       ... 
Stopping java-spring-mqtt_mqttserver_1 ... 
# wenn nochmal [Strg] + [c] gedrückt wird:
Killing java-spring-mqtt_node_1        ... done
Killing java-spring-mqtt_mqttserver_1  ... done
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
   * Spring Guides: https://spring.io/guides
 * MQTT
   * Webseite: https://www.eclipse.org/paho/clients/java/
   * JavaDoc: https://www.eclipse.org/paho/files/javadoc/index.html
   * Beispiele: https://github.com/eclipse/paho.mqtt.java/tree/master/org.eclipse.paho.sample.mqttclient


