#include <cstdlib>
#include <fstream>
#include <iostream>
#include <stdexcept>
#include <string>

#ifndef SERVER_SOURCE_FILE
#define SERVER_SOURCE_FILE "src/main.cpp"
#endif

static std::string read_file(const char* path) {
  std::ifstream in(path);
  if (!in) {
    throw std::runtime_error("cannot open source file");
  }
  return std::string((std::istreambuf_iterator<char>(in)), std::istreambuf_iterator<char>());
}

static void require_contains(const std::string& haystack, const std::string& needle) {
  if (haystack.find(needle) == std::string::npos) {
    std::cerr << "missing expected marker: " << needle << '\n';
    std::exit(1);
  }
}

int main() {
  const std::string source = read_file(SERVER_SOURCE_FILE);

  require_contains(source, "server.Get(\"/\"");
  require_contains(source, "server.Post(\"/client_post\"");
  require_contains(source, "server.Get(\"/database\"");
  require_contains(source, "server.Delete(\"/database/");

  return 0;
}
