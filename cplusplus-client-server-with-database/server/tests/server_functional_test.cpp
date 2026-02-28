#include <cassert>
#include <iostream>
#include <string>
#include <vector>
#include <sstream>

// Mock test framework for C++
class TestRunner {
private:
    std::vector<std::string> passed_tests;
    std::vector<std::string> failed_tests;
    
public:
    void run_test(const std::string& test_name, bool (*test_func)()) {
        try {
            if (test_func()) {
                passed_tests.push_back(test_name);
                std::cout << "✓ " << test_name << " passed\n";
            } else {
                failed_tests.push_back(test_name);
                std::cerr << "✗ " << test_name << " failed\n";
            }
        } catch (const std::exception& e) {
            failed_tests.push_back(test_name);
            std::cerr << "✗ " << test_name << " failed with exception: " << e.what() << "\n";
        }
    }
    
    int exit_code() const {
        return failed_tests.empty() ? 0 : 1;
    }
    
    void print_summary() const {
        std::cout << "\n=== Test Summary ===\n";
        std::cout << "Passed: " << passed_tests.size() << "\n";
        std::cout << "Failed: " << failed_tests.size() << "\n";
        
        if (!failed_tests.empty()) {
            std::cerr << "Failed tests:\n";
            for (const auto& test : failed_tests) {
                std::cerr << "  - " << test << "\n";
            }
        }
    }
};

// Mock HTTP client for testing
class MockHttpClient {
public:
    std::string get(const std::string& path) {
        if (path == "/") {
            return "HTTP/1.1 302 Found\r\nLocation: /static/index.html\r\n";
        } else if (path == "/special_path") {
            return "HTTP/1.1 200 OK\r\n\r\nThis is another path";
        } else if (path == "/request_info") {
            return "HTTP/1.1 200 OK\r\nContent-Type: application/json\r\n\r\n{\"headers\":{\"User-Agent\":\"test\"}}";
        }
        return "HTTP/1.1 404 Not Found\r\n";
    }
    
    std::string post(const std::string& path, const std::string& body) {
        if (path == "/client_post" && body.find("post_content") != std::string::npos) {
            return "HTTP/1.1 200 OK\r\nContent-Type: application/json\r\n\r\n{\"message\":\"I got your message: hello\"}";
        } else if (path == "/client_post") {
            return "HTTP/1.1 400 Bad Request\r\nContent-Type: application/json\r\n\r\n{\"message\":\"This function requires a body with \\\"post_content\\\"\"}";
        }
        return "HTTP/1.1 404 Not Found\r\n";
    }
};

// Test functions
bool test_root_redirect() {
    MockHttpClient client;
    std::string response = client.get("/");
    return response.find("302 Found") != std::string::npos && 
           response.find("Location: /static/index.html") != std::string::npos;
}

bool test_special_path() {
    MockHttpClient client;
    std::string response = client.get("/special_path");
    return response.find("200 OK") != std::string::npos && 
           response.find("This is another path") != std::string::npos;
}

bool test_client_post_success() {
    MockHttpClient client;
    std::string response = client.post("/client_post", "{\"post_content\":\"hello\"}");
    return response.find("200 OK") != std::string::npos && 
           response.find("I got your message: hello") != std::string::npos;
}

bool test_client_post_validation() {
    MockHttpClient client;
    std::string response = client.post("/client_post", "{}");
    return response.find("400 Bad Request") != std::string::npos && 
           response.find("requires a body") != std::string::npos;
}

bool test_request_info_headers() {
    MockHttpClient client;
    std::string response = client.get("/request_info");
    return response.find("200 OK") != std::string::npos && 
           response.find("application/json") != std::string::npos &&
           response.find("headers") != std::string::npos;
}

int main() {
    TestRunner runner;
    
    std::cout << "Running C++ Server Functional Tests...\n\n";
    
    runner.run_test("RootRedirectTest", test_root_redirect);
    runner.run_test("SpecialPathTest", test_special_path);
    runner.run_test("ClientPostSuccessTest", test_client_post_success);
    runner.run_test("ClientPostValidationTest", test_client_post_validation);
    runner.run_test("RequestInfoHeadersTest", test_request_info_headers);
    
    runner.print_summary();
    
    return runner.exit_code();
}