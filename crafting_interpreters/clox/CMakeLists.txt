cmake_minimum_required(VERSION 3.10)

project(clox C)

set(C_STANDARD C20)

set(SOURCES
  src/chunk.c
  src/compiler.c
  src/debug.c
  src/main.c
  src/memory.c
  src/object.c
  src/scanner.c
  src/table.c
  src/utils.c
  src/value.c
  src/vm.c
)

add_executable(clox ${SOURCES})

target_include_directories(clox
  PRIVATE
      ${PROJECT_SOURCE_DIR}/include
)