package hello;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class DatabaseStartupCheck {
    private static final Logger LOG = LoggerFactory.getLogger(DatabaseStartupCheck.class);

    private final JdbcTemplate jdbcTemplate;

    public DatabaseStartupCheck(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void verifyDatabaseConnection() {
        final int maxRetries = 10;
        final long retryDelayMs = 5000;

        for (int i = 1; i <= maxRetries; i++) {
            try {
                Integer result = jdbcTemplate.queryForObject("SELECT 1 + 1 AS solution", Integer.class);
                if (result != null && result == 2) {
                    LOG.info("Database connected and works");
                    return;
                }
            } catch (Exception ex) {
                LOG.warn("Database check failed ({}/{}): {}", i, maxRetries, ex.getMessage());
            }

            try {
                Thread.sleep(retryDelayMs);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                throw new IllegalStateException("Interrupted while waiting for DB retry", e);
            }
        }

        throw new IllegalStateException("Max retries exceeded. Could not validate database connection.");
    }
}
