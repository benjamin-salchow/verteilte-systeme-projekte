package hello;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.http.MediaType;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

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
}
