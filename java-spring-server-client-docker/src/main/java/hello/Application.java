package hello;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}

}
