package hello;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.MqttMessage;
import org.eclipse.paho.client.mqttv3.persist.MemoryPersistence;
import java.util.Random;

@SpringBootApplication
@RestController
public class Application {

  // Entrypoint - call it with: http://localhost:8080/
  @RequestMapping("/")
  public String home() {
    System.out.println("Got a request and serving 'Hello World");
    return "Hello World";
  }

  // Another GET Path - call it with: http://localhost:8080/special_path
  @RequestMapping("/special_path")
  public String specialPath() {
    return "This is another path";
  }

  public static void main(final String[] args) {
    // MQTT
    // Config of MQTT
    final String topic = "mytopic";
    final String content = "My message:";
    final int qos = 2;
    final String broker = "tcp://mqttserver";
    final String clientId = "JavaSample";
    final MemoryPersistence persistence = new MemoryPersistence();
    // MQTT Thread
    Random rand = new Random();
    final Thread thread = new Thread() {
      public void run() {
        System.out.println("Thread Running");
        try {
          final MqttClient sampleClient = new MqttClient(broker, clientId, persistence);
          final MqttConnectOptions connOpts = new MqttConnectOptions();
          connOpts.setCleanSession(true);
          System.out.println("Connecting to broker: " + broker);
          sampleClient.connect(connOpts);
          System.out.println("Connected");
          System.out.println("Publishing message: " + content);
          final MqttMessage message = new MqttMessage(content.getBytes());
          message.setQos(qos);
          sampleClient.publish(topic, message);
          System.out.println("Message published");
          sampleClient.subscribe(topic, qos);
          System.out.println("test");
          while (true) {
            String loop_content = content + rand.nextInt(50);
            System.out.println("Publishing message: " + loop_content);
            final MqttMessage messageloop = new MqttMessage(loop_content.getBytes());
            message.setQos(qos);
            sampleClient.publish(topic, messageloop);
            try {
              this.sleep(3000);
            } catch (final Exception e) {
              System.out.println("Error on sleep: " + e);
            }
          }

        } catch (final MqttException me) {
          System.out.println("reason " + me.getReasonCode());
          System.out.println("msg " + me.getMessage());
          System.out.println("loc " + me.getLocalizedMessage());
          System.out.println("cause " + me.getCause());
          System.out.println("excep " + me);
          me.printStackTrace();
        }
      }
    };

    thread.start();

    SpringApplication.run(Application.class, args);
  }

}
