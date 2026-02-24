package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"math/rand/v2"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	_ "github.com/go-sql-driver/mysql"
)

const (
	maxRetries = 10
	retryDelay = 5 * time.Second
)

type server struct {
	db *sql.DB
}

type postBody struct {
	PostContent string `json:"post_content"`
}

type dbPostBody struct {
	Title       string `json:"title"`
	Description string `json:"description"`
}

type dbEntry struct {
	TaskID      int       `json:"task_id"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	CreatedAt   time.Time `json:"created_at"`
}

func main() {
	db, err := initDB()
	if err != nil {
		log.Fatalf("db init failed: %v", err)
	}
	defer db.Close()

	s := &server{db: db}

	mux := http.NewServeMux()
	mux.HandleFunc("/", s.rootHandler)
	mux.HandleFunc("/special_path", s.specialPathHandler)
	mux.HandleFunc("/request_info", s.requestInfoHandler)
	mux.HandleFunc("/client_post", s.clientPostHandler)
	mux.HandleFunc("/button1_name", s.button1NameHandler)
	mux.HandleFunc("/button1_name/", s.button1NameHandler)
	mux.HandleFunc("/button2", s.button2Handler)
	mux.HandleFunc("/database", s.databaseHandler)
	mux.HandleFunc("/database/", s.databaseDeleteHandler)
	mux.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("public"))))

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	addr := "0.0.0.0:" + port
	log.Printf("Running on http://%s", addr)
	if err := http.ListenAndServe(addr, mux); err != nil {
		log.Fatalf("server failed: %v", err)
	}
}

func initDB() (*sql.DB, error) {
	host := os.Getenv("MYSQL_HOSTNAME")
	user := os.Getenv("MYSQL_USER")
	pass := os.Getenv("MYSQL_PASSWORD")
	name := os.Getenv("MYSQL_DATABASE")

	dsn := fmt.Sprintf("%s:%s@tcp(%s:3306)/%s?parseTime=true", user, pass, host, name)
	var db *sql.DB
	var err error

	for i := 1; i <= maxRetries; i++ {
		db, err = sql.Open("mysql", dsn)
		if err == nil {
			err = db.Ping()
		}
		if err == nil {
			break
		}

		log.Printf("Failed to connect to DB (attempt %d/%d): %v", i, maxRetries, err)
		time.Sleep(retryDelay)
	}

	if err != nil {
		return nil, fmt.Errorf("max retries exceeded: %w", err)
	}

	var solution int
	if err := db.QueryRow("SELECT 1 + 1 AS solution").Scan(&solution); err != nil {
		return nil, fmt.Errorf("db check query failed: %w", err)
	}
	if solution != 2 {
		return nil, fmt.Errorf("db check returned invalid result: %d", solution)
	}

	log.Println("Database connected and works")
	return db, nil
}

func (s *server) rootHandler(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/" {
		http.NotFound(w, r)
		return
	}
	http.Redirect(w, r, "/static/index.html", http.StatusFound)
}

func (s *server) specialPathHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}
	_, _ = w.Write([]byte("This is another path"))
}

func (s *server) requestInfoHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}
	_, _ = w.Write([]byte("This is all I got from the request: " + fmt.Sprintf("%v", r.Header)))
}

func (s *server) clientPostHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var body postBody
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil || body.PostContent == "" {
		writeJSON(w, http.StatusBadRequest, map[string]string{"message": "This function requires a body with \"post_content\""})
		return
	}

	writeJSON(w, http.StatusOK, map[string]string{"message": "I got your message: " + body.PostContent})
}

func (s *server) button1NameHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	name := ""
	if strings.Contains(r.Header.Get("Content-Type"), "application/json") {
		var payload map[string]string
		if err := json.NewDecoder(r.Body).Decode(&payload); err == nil {
			name = payload["name"]
		}
	} else {
		_ = r.ParseForm()
		name = r.FormValue("name")
	}

	writeJSON(w, http.StatusOK, map[string]string{"message": "I got your message - Name is: " + name})
}

func (s *server) button2Handler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}
	n := rand.Float64()
	_, _ = w.Write([]byte(fmt.Sprintf("Antwort: %.5f", n)))
}

func (s *server) databaseHandler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		s.handleDatabaseGet(w)
	case http.MethodPost:
		s.handleDatabasePost(w, r)
	default:
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
	}
}

func (s *server) handleDatabaseGet(w http.ResponseWriter) {
	rows, err := s.db.Query("SELECT task_id, title, description, created_at FROM table1")
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}
	defer rows.Close()

	entries := make([]dbEntry, 0)
	for rows.Next() {
		var e dbEntry
		if err := rows.Scan(&e.TaskID, &e.Title, &e.Description, &e.CreatedAt); err != nil {
			writeJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
			return
		}
		entries = append(entries, e)
	}

	writeJSON(w, http.StatusOK, entries)
}

func (s *server) handleDatabasePost(w http.ResponseWriter, r *http.Request) {
	var payload dbPostBody
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil || payload.Title == "" || payload.Description == "" {
		writeJSON(w, http.StatusBadRequest, map[string]string{"message": "This function requires a body with \"title\" and \"description\""})
		return
	}

	_, err := s.db.Exec(
		"INSERT INTO table1 (title, description, created_at) VALUES (?, ?, CURRENT_TIMESTAMP)",
		payload.Title,
		payload.Description,
	)
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}

	writeJSON(w, http.StatusOK, map[string]string{"message": "Inserted"})
}

func (s *server) databaseDeleteHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodDelete {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	idStr := strings.TrimPrefix(r.URL.Path, "/database/")
	if idStr == "" {
		http.NotFound(w, r)
		return
	}

	id, err := strconv.Atoi(idStr)
	if err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "id must be an integer"})
		return
	}

	_, err = s.db.Exec("DELETE FROM table1 WHERE task_id = ?", id)
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}

	writeJSON(w, http.StatusOK, map[string]string{"message": "Deleted"})
}

func writeJSON(w http.ResponseWriter, status int, payload any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(payload)
}
