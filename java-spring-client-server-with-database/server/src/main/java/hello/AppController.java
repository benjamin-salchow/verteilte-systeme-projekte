package hello;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ThreadLocalRandom;

@RestController
public class AppController {
    private static final Logger LOG = LoggerFactory.getLogger(AppController.class);
    private final JdbcTemplate jdbcTemplate;

    public AppController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping("/")
    public ResponseEntity<Void> root() {
        return ResponseEntity.status(HttpStatus.FOUND)
                .header("Location", "/static/index.html")
                .build();
    }

    @GetMapping("/special_path")
    public String specialPath() {
        return "This is another path";
    }

    @GetMapping("/request_info")
    public String requestInfo(@RequestHeader Map<String, String> headers) {
        return "This is all I got from the request: " + headers;
    }

    @PostMapping("/client_post")
    public ResponseEntity<Map<String, String>> clientPost(@RequestBody(required = false) Map<String, String> body) {
        if (body == null || body.get("post_content") == null || body.get("post_content").isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "This function requires a body with \"post_content\""));
        }

        return ResponseEntity.ok(Map.of("message", "I got your message: " + body.get("post_content")));
    }

    @PostMapping(path = {"/button1_name", "/button1_name/"}, consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    public ResponseEntity<Map<String, String>> button1NameForm(@RequestParam(value = "name", required = false) String name) {
        if (name == null) {
            name = "";
        }
        return ResponseEntity.ok(Map.of("message", "I got your message - Name is: " + name));
    }

    @PostMapping(path = {"/button1_name", "/button1_name/"}, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, String>> button1NameJson(@RequestBody(required = false) Map<String, String> jsonBody) {
        String name = "";
        if (jsonBody != null && jsonBody.get("name") != null) {
            name = jsonBody.get("name");
        }
        return ResponseEntity.ok(Map.of("message", "I got your message - Name is: " + name));
    }

    @GetMapping("/button2")
    public String button2() {
        double randomNumber = ThreadLocalRandom.current().nextDouble();
        return "Antwort: " + String.format("%.5f", randomNumber);
    }

    @GetMapping("/database")
    public ResponseEntity<?> getDatabaseEntries() {
        try {
            List<Map<String, Object>> rows = jdbcTemplate.query("SELECT task_id, title, description, created_at FROM table1",
                    (rs, rowNum) -> {
                        Map<String, Object> row = new HashMap<>();
                        row.put("task_id", rs.getInt("task_id"));
                        row.put("title", rs.getString("title"));
                        row.put("description", rs.getString("description"));
                        row.put("created_at", rs.getObject("created_at", LocalDateTime.class));
                        return row;
                    });
            return ResponseEntity.ok(rows);
        } catch (Exception ex) {
            LOG.error("Failed loading DB entries", ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", ex.getMessage()));
        }
    }

    @PostMapping("/database")
    public ResponseEntity<Map<String, String>> addDatabaseEntry(@RequestBody(required = false) Map<String, String> body) {
        if (body == null || body.get("title") == null || body.get("description") == null
                || body.get("title").isBlank() || body.get("description").isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "This function requires a body with \"title\" and \"description\""));
        }

        try {
            jdbcTemplate.update("INSERT INTO table1 (title, description, created_at) VALUES (?, ?, CURRENT_TIMESTAMP)",
                    body.get("title"), body.get("description"));
            return ResponseEntity.ok(Map.of("message", "Inserted"));
        } catch (Exception ex) {
            LOG.error("Insert failed", ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", ex.getMessage()));
        }
    }

    @DeleteMapping("/database/{id}")
    public ResponseEntity<Map<String, String>> deleteDatabaseEntry(@PathVariable int id) {
        try {
            jdbcTemplate.update("DELETE FROM table1 WHERE task_id = ?", id);
            return ResponseEntity.ok(Map.of("message", "Deleted"));
        } catch (Exception ex) {
            LOG.error("Delete failed", ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", ex.getMessage()));
        }
    }
}
