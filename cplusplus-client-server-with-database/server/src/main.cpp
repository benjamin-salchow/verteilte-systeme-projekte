#include <mysql.h>
#include <nlohmann/json.hpp>

#include <chrono>
#include <cstdlib>
#include <cstring>
#include <iomanip>
#include <iostream>
#include <memory>
#include <optional>
#include <sstream>
#include <stdexcept>
#include <string>
#include <thread>

#include <httplib.h>

using json = nlohmann::json;

namespace {

struct DbConfig {
  std::string host;
  std::string user;
  std::string password;
  std::string database;
  unsigned int port;
};

using MysqlPtr = std::unique_ptr<MYSQL, decltype(&mysql_close)>;

DbConfig load_db_config() {
  const char* host = std::getenv("MYSQL_HOSTNAME");
  const char* user = std::getenv("MYSQL_USER");
  const char* password = std::getenv("MYSQL_PASSWORD");
  const char* database = std::getenv("MYSQL_DATABASE");

  return DbConfig{
      host ? host : "localhost",
      user ? user : "exampleuser",
      password ? password : "examplepass",
      database ? database : "exampledb",
      3306,
  };
}

MysqlPtr connect_db(const DbConfig& cfg, int retries = 10, int delay_seconds = 5) {
  for (int i = 1; i <= retries; ++i) {
    MYSQL* raw = mysql_init(nullptr);
    if (!raw) {
      throw std::runtime_error("mysql_init failed");
    }

    if (mysql_real_connect(raw, cfg.host.c_str(), cfg.user.c_str(), cfg.password.c_str(),
                           cfg.database.c_str(), cfg.port, nullptr, 0) != nullptr) {
      return MysqlPtr(raw, mysql_close);
    }

    std::string err = mysql_error(raw);
    mysql_close(raw);

    std::cerr << "DB connection failed (" << i << "/" << retries << "): " << err << '\n';
    if (i < retries) {
      std::this_thread::sleep_for(std::chrono::seconds(delay_seconds));
    }
  }

  throw std::runtime_error("Could not connect to DB after retries");
}

void ensure_db_works(const DbConfig& cfg) {
  auto conn = connect_db(cfg);
  if (mysql_query(conn.get(), "SELECT 1 + 1 AS solution") != 0) {
    throw std::runtime_error(mysql_error(conn.get()));
  }

  MYSQL_RES* res = mysql_store_result(conn.get());
  if (!res) {
    throw std::runtime_error("No DB result");
  }

  MYSQL_ROW row = mysql_fetch_row(res);
  if (!row || !row[0] || std::string(row[0]) != "2") {
    mysql_free_result(res);
    throw std::runtime_error("DB check returned wrong result");
  }

  mysql_free_result(res);
  std::cout << "Database connected and works" << std::endl;
}

bool db_insert(const DbConfig& cfg, const std::string& title, const std::string& description,
               std::string& err) {
  auto conn = connect_db(cfg);

  MYSQL_STMT* stmt = mysql_stmt_init(conn.get());
  if (!stmt) {
    err = "mysql_stmt_init failed";
    return false;
  }

  const char* sql =
      "INSERT INTO table1 (title, description, created_at) VALUES (?, ?, CURRENT_TIMESTAMP)";
  if (mysql_stmt_prepare(stmt, sql, static_cast<unsigned long>(std::strlen(sql))) != 0) {
    err = mysql_stmt_error(stmt);
    mysql_stmt_close(stmt);
    return false;
  }

  MYSQL_BIND bind[2]{};
  unsigned long title_len = static_cast<unsigned long>(title.size());
  unsigned long desc_len = static_cast<unsigned long>(description.size());

  bind[0].buffer_type = MYSQL_TYPE_STRING;
  bind[0].buffer = const_cast<char*>(title.data());
  bind[0].buffer_length = title_len;
  bind[0].length = &title_len;

  bind[1].buffer_type = MYSQL_TYPE_STRING;
  bind[1].buffer = const_cast<char*>(description.data());
  bind[1].buffer_length = desc_len;
  bind[1].length = &desc_len;

  if (mysql_stmt_bind_param(stmt, bind) != 0) {
    err = mysql_stmt_error(stmt);
    mysql_stmt_close(stmt);
    return false;
  }

  if (mysql_stmt_execute(stmt) != 0) {
    err = mysql_stmt_error(stmt);
    mysql_stmt_close(stmt);
    return false;
  }

  mysql_stmt_close(stmt);
  return true;
}

bool db_delete(const DbConfig& cfg, int id, std::string& err) {
  auto conn = connect_db(cfg);

  MYSQL_STMT* stmt = mysql_stmt_init(conn.get());
  if (!stmt) {
    err = "mysql_stmt_init failed";
    return false;
  }

  const char* sql = "DELETE FROM table1 WHERE task_id = ?";
  if (mysql_stmt_prepare(stmt, sql, static_cast<unsigned long>(std::strlen(sql))) != 0) {
    err = mysql_stmt_error(stmt);
    mysql_stmt_close(stmt);
    return false;
  }

  MYSQL_BIND bind[1]{};
  bind[0].buffer_type = MYSQL_TYPE_LONG;
  bind[0].buffer = &id;

  if (mysql_stmt_bind_param(stmt, bind) != 0) {
    err = mysql_stmt_error(stmt);
    mysql_stmt_close(stmt);
    return false;
  }

  if (mysql_stmt_execute(stmt) != 0) {
    err = mysql_stmt_error(stmt);
    mysql_stmt_close(stmt);
    return false;
  }

  mysql_stmt_close(stmt);
  return true;
}

std::optional<json> db_get_all(const DbConfig& cfg, std::string& err) {
  auto conn = connect_db(cfg);

  if (mysql_query(conn.get(), "SELECT task_id, title, description, created_at FROM table1") != 0) {
    err = mysql_error(conn.get());
    return std::nullopt;
  }

  MYSQL_RES* res = mysql_store_result(conn.get());
  if (!res) {
    err = "No result from database";
    return std::nullopt;
  }

  int task_id_idx = -1;
  int title_idx = -1;
  int desc_idx = -1;
  int created_idx = -1;

  MYSQL_FIELD* fields = mysql_fetch_fields(res);
  unsigned int count = mysql_num_fields(res);
  for (unsigned int i = 0; i < count; ++i) {
    std::string name = fields[i].name;
    if (name == "task_id") task_id_idx = static_cast<int>(i);
    if (name == "title") title_idx = static_cast<int>(i);
    if (name == "description") desc_idx = static_cast<int>(i);
    if (name == "created_at") created_idx = static_cast<int>(i);
  }

  json arr = json::array();
  MYSQL_ROW row;
  while ((row = mysql_fetch_row(res))) {
    json item;
    item["task_id"] = (task_id_idx >= 0 && row[task_id_idx]) ? std::stoi(row[task_id_idx]) : 0;
    item["title"] = (title_idx >= 0 && row[title_idx]) ? row[title_idx] : "";
    item["description"] = (desc_idx >= 0 && row[desc_idx]) ? row[desc_idx] : "";
    item["created_at"] = (created_idx >= 0 && row[created_idx]) ? row[created_idx] : "";
    arr.push_back(item);
  }

  mysql_free_result(res);
  return arr;
}

std::string request_headers_as_json(const httplib::Request& req) {
  json headers = json::object();
  for (const auto& h : req.headers) {
    headers[h.first] = h.second;
  }
  return headers.dump();
}

}  // namespace

int main() {
  const DbConfig db_cfg = load_db_config();

  try {
    ensure_db_works(db_cfg);
  } catch (const std::exception& ex) {
    std::cerr << "Database startup check failed: " << ex.what() << std::endl;
    return 1;
  }

  httplib::Server server;

  if (!server.set_mount_point("/static", "./public")) {
    std::cerr << "Warning: Could not mount ./public on /static" << std::endl;
  }

  server.Get("/", [](const httplib::Request&, httplib::Response& res) {
    res.set_redirect("/static/index.html");
  });

  server.Get("/special_path", [](const httplib::Request&, httplib::Response& res) {
    res.set_content("This is another path", "text/plain; charset=utf-8");
  });

  server.Get("/request_info", [](const httplib::Request& req, httplib::Response& res) {
    res.set_content("This is all I got from the request: " + request_headers_as_json(req),
                    "text/plain; charset=utf-8");
  });

  server.Post("/client_post", [](const httplib::Request& req, httplib::Response& res) {
    try {
      auto body = json::parse(req.body);
      if (!body.contains("post_content") || body["post_content"].get<std::string>().empty()) {
        res.status = 400;
        res.set_content(json{{"message", "This function requires a body with \"post_content\""}}.dump(),
                        "application/json");
        return;
      }
      std::string post_content = body["post_content"].get<std::string>();
      res.set_content(json{{"message", "I got your message: " + post_content}}.dump(), "application/json");
    } catch (...) {
      res.status = 400;
      res.set_content(json{{"message", "Invalid JSON body"}}.dump(), "application/json");
    }
  });

  server.Post(R"(/button1_name/?)", [](const httplib::Request& req, httplib::Response& res) {
    std::string name;
    if (req.has_param("name")) {
      name = req.get_param_value("name");
    } else {
      try {
        auto body = json::parse(req.body);
        if (body.contains("name") && body["name"].is_string()) {
          name = body["name"].get<std::string>();
        }
      } catch (...) {
      }
    }

    res.set_content(json{{"message", "I got your message - Name is: " + name}}.dump(), "application/json");
  });

  server.Get("/button2", [](const httplib::Request&, httplib::Response& res) {
    std::ostringstream out;
    out << "Antwort: " << std::fixed << std::setprecision(5)
        << (static_cast<double>(std::rand()) / static_cast<double>(RAND_MAX));
    res.set_content(out.str(), "text/plain; charset=utf-8");
  });

  server.Get("/database", [db_cfg](const httplib::Request&, httplib::Response& res) {
    std::string err;
    auto data = db_get_all(db_cfg, err);
    if (!data.has_value()) {
      res.status = 500;
      res.set_content(json{{"error", err}}.dump(), "application/json");
      return;
    }
    res.set_content(data->dump(), "application/json");
  });

  server.Post("/database", [db_cfg](const httplib::Request& req, httplib::Response& res) {
    try {
      auto body = json::parse(req.body);
      if (!body.contains("title") || !body.contains("description") ||
          body["title"].get<std::string>().empty() || body["description"].get<std::string>().empty()) {
        res.status = 400;
        res.set_content(
            json{{"message", "This function requires a body with \"title\" and \"description\""}}.dump(),
            "application/json");
        return;
      }

      std::string err;
      if (!db_insert(db_cfg, body["title"].get<std::string>(), body["description"].get<std::string>(), err)) {
        res.status = 500;
        res.set_content(json{{"error", err}}.dump(), "application/json");
        return;
      }

      res.set_content(json{{"message", "Inserted"}}.dump(), "application/json");
    } catch (...) {
      res.status = 400;
      res.set_content(json{{"message", "Invalid JSON body"}}.dump(), "application/json");
    }
  });

  server.Delete(R"(/database/(\d+))", [db_cfg](const httplib::Request& req, httplib::Response& res) {
    int id = std::stoi(req.matches[1]);
    std::string err;
    if (!db_delete(db_cfg, id, err)) {
      res.status = 500;
      res.set_content(json{{"error", err}}.dump(), "application/json");
      return;
    }

    res.set_content(json{{"message", "Deleted"}}.dump(), "application/json");
  });

  int port = 8080;
  if (const char* env_port = std::getenv("PORT"); env_port != nullptr) {
    port = std::atoi(env_port);
  }

  std::cout << "Running on http://0.0.0.0:" << port << std::endl;
  server.listen("0.0.0.0", port);
  return 0;
}
