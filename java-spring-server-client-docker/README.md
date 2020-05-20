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
Successfully built e129baf9b757
Successfully tagged java-spring-server-client-docker_server:latest
Recreating java-spring-server-client-docker_server_1 ... done
Attaching to java-spring-server-client-docker_server_1
server_1  | 
server_1  |   .   ____          _            __ _ _
server_1  |  /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
server_1  | ( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
server_1  |  \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
server_1  |   '  |____| .__|_| |_|_| |_\__, | / / / /
server_1  |  =========|_|==============|___/=/_/_/_/
server_1  |  :: Spring Boot ::        (v2.2.1.RELEASE)
server_1  | 
server_1  | 2020-03-16 20:46:31.208  INFO 1 --- [           main] hello.Application                        : Starting Application on 78d0b676af67 with PID 1 (/app.jar started by spring in /)
server_1  | 2020-03-16 20:46:31.217  INFO 1 --- [           main] hello.Application                        : No active profile set, falling back to default profiles: default
server_1  | 2020-03-16 20:46:34.455  INFO 1 --- [           main] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat initialized with port(s): 8080 (http)
server_1  | 2020-03-16 20:46:34.497  INFO 1 --- [           main] o.apache.catalina.core.StandardService   : Starting service [Tomcat]
server_1  | 2020-03-16 20:46:34.498  INFO 1 --- [           main] org.apache.catalina.core.StandardEngine  : Starting Servlet engine: [Apache Tomcat/9.0.27]
server_1  | 2020-03-16 20:46:34.712  INFO 1 --- [           main] o.a.c.c.C.[Tomcat].[localhost].[/]       : Initializing Spring embedded WebApplicationContext
server_1  | 2020-03-16 20:46:34.712  INFO 1 --- [           main] o.s.web.context.ContextLoader            : Root WebApplicationContext: initialization completed in 3220 ms
server_1  | 2020-03-16 20:46:35.269  INFO 1 --- [           main] o.s.s.concurrent.ThreadPoolTaskExecutor  : Initializing ExecutorService 'applicationTaskExecutor'
server_1  | 2020-03-16 20:46:35.957  INFO 1 --- [           main] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat started on port(s): 8080 (http) with context path ''
server_1  | 2020-03-16 20:46:35.967  INFO 1 --- [           main] hello.Application                        : Started Application in 6.391 seconds (JVM running for 8.022)
server_1  | 2020-03-16 20:46:51.386  INFO 1 --- [nio-8080-exec-1] o.a.c.c.C.[Tomcat].[localhost].[/]       : Initializing Spring DispatcherServlet 'dispatcherServlet'
server_1  | 2020-03-16 20:46:51.387  INFO 1 --- [nio-8080-exec-1] o.s.web.servlet.DispatcherServlet        : Initializing Servlet 'dispatcherServlet'
server_1  | 2020-03-16 20:46:51.423  INFO 1 --- [nio-8080-exec-1] o.s.web.servlet.DispatcherServlet        : Completed initialization in 35 ms
server_1  | Got a request and serving 'Hello World
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

**Hinweis:** Alternativ kann natürlich auch Maven (`mvn`) für das Bauen anstelle von Gradle verwendet werden mittels:
```sh
# Compile Java Code:
mvn compile
# Package files for container:
mvn package 
```

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
  


