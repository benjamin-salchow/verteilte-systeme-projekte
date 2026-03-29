/*
 * Copyright 2012-2014 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *	https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package hello;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.reactive.function.client.WebClient;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
public class HelloWorldConfigurationTests {

	@LocalServerPort
	private int port;

	@Test
	void rootEndpointReturnsHelloWorld() {
		ResponseEntity<String> response = WebClient.create("http://localhost:" + this.port)
			.get()
			.uri("/")
			.retrieve()
			.toEntity(String.class)
			.block();

		assertEquals(HttpStatus.OK, response.getStatusCode());
		assertEquals("Hello World", response.getBody());
	}

	@Test
	void specialPathReturnsSecondaryText() {
		ResponseEntity<String> response = WebClient.create("http://localhost:" + this.port)
			.get()
			.uri("/special_path")
			.retrieve()
			.toEntity(String.class)
			.block();

		assertEquals(HttpStatus.OK, response.getStatusCode());
		assertEquals("This is another path", response.getBody());
	}

	@Test
	void unknownRouteReturnsNotFound() {
		ResponseEntity<String> response = WebClient.create("http://localhost:" + this.port)
			.get()
			.uri("/missing")
			.exchangeToMono(clientResponse -> clientResponse.toEntity(String.class))
			.block();

		assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
	}

}
