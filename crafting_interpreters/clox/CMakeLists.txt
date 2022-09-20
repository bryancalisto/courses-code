cmake_minimum_required(VERSION 3.10)

project(clox)

set(SOURCES
  src/chunk.c
  src/compiler.c
  src/debug.c
  src/main.c
  src/memory.c
  src/scanner.c
  src/utils.c
  src/value.c
  src/vm.c
)

add_executable(clox ${SOURCES})

target_include_directories(clox
  PRIVATE
      ${PROJECT_SOURCE_DIR}/include
)