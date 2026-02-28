cmake_minimum_required(VERSION 3.20)
project(cplusplus_client_server_with_database LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

include(FetchContent)
FetchContent_Declare(
  cpp_httplib
  GIT_REPOSITORY https://github.com/yhirose/cpp-httplib.git
  GIT_TAG af56b7ec0ba9d18b788ed064f76d936eb52c5db5 # v0.16.3
)
FetchContent_MakeAvailable(cpp_httplib)
enable_testing()

find_package(PkgConfig REQUIRED)
pkg_check_modules(MARIADB REQUIRED libmariadb)
find_package(nlohmann_json REQUIRED)

add_executable(server src/main.cpp)
target_include_directories(server PRIVATE ${MARIADB_INCLUDE_DIRS})
target_compile_options(server PRIVATE ${MARIADB_CFLAGS_OTHER})
target_link_libraries(server PRIVATE httplib::httplib ${MARIADB_LIBRARIES} nlohmann_json::nlohmann_json)

add_executable(server_static_checks tests/server_static_checks.cpp)
target_compile_definitions(server_static_checks PRIVATE SERVER_SOURCE_FILE="${CMAKE_CURRENT_SOURCE_DIR}/src/main.cpp")
add_test(NAME server_static_checks COMMAND server_static_checks)

add_executable(server_functional_test tests/server_functional_test.cpp)
add_test(NAME server_functional_test COMMAND server_functional_test)
