package main

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

func TestRootHandlerRedirectsToStatic(t *testing.T) {
	s := &server{}
	req := httptest.NewRequest(http.MethodGet, "/", nil)
	rr := httptest.NewRecorder()

	s.rootHandler(rr, req)

	if rr.Code != http.StatusFound {
		t.Fatalf("expected %d, got %d", http.StatusFound, rr.Code)
	}
	if got := rr.Header().Get("Location"); got != "/static/index.html" {
		t.Fatalf("expected redirect to /static/index.html, got %q", got)
	}
}

func TestSpecialPathHandlerMethodValidation(t *testing.T) {
	s := &server{}
	req := httptest.NewRequest(http.MethodPost, "/special_path", nil)
	rr := httptest.NewRecorder()

	s.specialPathHandler(rr, req)

	if rr.Code != http.StatusMethodNotAllowed {
		t.Fatalf("expected %d, got %d", http.StatusMethodNotAllowed, rr.Code)
	}
}

func TestClientPostHandlerValidation(t *testing.T) {
	s := &server{}
	req := httptest.NewRequest(http.MethodPost, "/client_post", strings.NewReader(`{"post_content":"hello"}`))
	req.Header.Set("Content-Type", "application/json")
	rr := httptest.NewRecorder()

	s.clientPostHandler(rr, req)

	if rr.Code != http.StatusOK {
		t.Fatalf("expected %d, got %d", http.StatusOK, rr.Code)
	}
	var payload map[string]string
	if err := json.Unmarshal(rr.Body.Bytes(), &payload); err != nil {
		t.Fatalf("invalid json response: %v", err)
	}
	if payload["message"] != "I got your message: hello" {
		t.Fatalf("unexpected message: %q", payload["message"])
	}
}

func TestRequestInfoHandlerReturnsJSON(t *testing.T) {
	s := &server{}
	req := httptest.NewRequest(http.MethodGet, "/request_info", nil)
	req.Header.Set("X-Test", "ok")
	rr := httptest.NewRecorder()

	s.requestInfoHandler(rr, req)

	if rr.Code != http.StatusOK {
		t.Fatalf("expected %d, got %d", http.StatusOK, rr.Code)
	}
	if ct := rr.Header().Get("Content-Type"); !strings.Contains(ct, "application/json") {
		t.Fatalf("expected json content type, got %q", ct)
	}
}
