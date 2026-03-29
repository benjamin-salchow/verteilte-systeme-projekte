package hello;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.http.MediaType;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;
import java.util.Map;

@WebMvcTest(AppController.class)
class AppControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private JdbcTemplate jdbcTemplate;

    @Test
    void rootRedirectsToStaticIndex() throws Exception {
        mockMvc.perform(get("/"))
                .andExpect(status().isFound())
                .andExpect(header().string("Location", "/static/index.html"));
    }

    @Test
    void clientPostReturnsValidationErrorForMissingBodyField() throws Exception {
        mockMvc.perform(post("/client_post")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("This function requires a body with \"post_content\""));
    }

    @Test
    void clientPostReturnsSuccessForValidBody() throws Exception {
        mockMvc.perform(post("/client_post")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"post_content\":\"hello\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("I got your message: hello"));
    }

    @Test
    void specialPathReturnsPlainText() throws Exception {
        mockMvc.perform(get("/special_path"))
                .andExpect(status().isOk())
                .andExpect(content().string("This is another path"));
    }

    @Test
    void requestInfoReturnsHeadersAsJson() throws Exception {
        mockMvc.perform(get("/request_info").header("X-Test", "java"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("This is all I got from the request"))
                .andExpect(jsonPath("$.headers.X-Test").value("java"));
    }

    @Test
    void button1NameAcceptsJson() throws Exception {
        mockMvc.perform(post("/button1_name")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Alice\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("I got your message - Name is: Alice"));
    }

    @Test
    void button1NameAcceptsFormData() throws Exception {
        mockMvc.perform(post("/button1_name")
                        .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                        .param("name", "Bob"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("I got your message - Name is: Bob"));
    }

    @Test
    void button2ReturnsFormattedResponse() throws Exception {
        mockMvc.perform(get("/button2"))
                .andExpect(status().isOk())
                .andExpect(content().string(org.hamcrest.Matchers.startsWith("Antwort: ")));
    }

    @Test
    void getDatabaseEntriesReturnsRowsFromJdbcTemplate() throws Exception {
        when(jdbcTemplate.query(org.mockito.ArgumentMatchers.anyString(), org.mockito.ArgumentMatchers.any(org.springframework.jdbc.core.RowMapper.class)))
                .thenReturn(List.of(Map.of("task_id", 1, "title", "T", "description", "D", "created_at", "2026-03-29T10:00:00")));

        mockMvc.perform(get("/database"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].task_id").value(1))
                .andExpect(jsonPath("$[0].title").value("T"));
    }

    @Test
    void addDatabaseEntryRejectsIncompleteBody() throws Exception {
        mockMvc.perform(post("/database")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"title\":\"missing description\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("This function requires a body with \"title\" and \"description\""));
    }

    @Test
    void deleteDatabaseEntryReturnsSuccess() throws Exception {
        mockMvc.perform(delete("/database/5"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Deleted"));
    }

    @Test
    void getDatabaseEntriesReturnsServerErrorOnJdbcFailure() throws Exception {
        when(jdbcTemplate.query(org.mockito.ArgumentMatchers.anyString(), org.mockito.ArgumentMatchers.any(org.springframework.jdbc.core.RowMapper.class)))
                .thenThrow(new RuntimeException("boom"));

        mockMvc.perform(get("/database"))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.error").value("boom"));
    }
}
