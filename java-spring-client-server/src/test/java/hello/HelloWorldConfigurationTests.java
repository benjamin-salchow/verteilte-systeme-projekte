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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
public class HelloWorldConfigurationTests {

	@Autowired
	private TestRestTemplate restTemplate;

	@Test
	void rootEndpointReturnsHelloWorld() {
		ResponseEntity<String> response = restTemplate.getForEntity("/", String.class);

		assertEquals(HttpStatus.OK, response.getStatusCode());
		assertEquals("Hello World", response.getBody());
	}

	@Test
	void specialPathReturnsSecondaryText() {
		ResponseEntity<String> response = restTemplate.getForEntity("/special_path", String.class);

		assertEquals(HttpStatus.OK, response.getStatusCode());
		assertEquals("This is another path", response.getBody());
	}

	@Test
	void unknownRouteReturnsNotFound() {
		ResponseEntity<String> response = restTemplate.getForEntity("/missing", String.class);

		assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
	}

}
