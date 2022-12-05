#ifndef clox_chunk_h
#define clox_chunk_h

#include "common.h"
#include "value.h"

typedef enum
{
  OP_ADD,
  OP_EQUAL,
  OP_GREATER,
  OP_LESS,
  OP_SUBTRACT,
  OP_MULTIPLY,
  OP_DIVIDE,
  OP_CONSTANT,
  OP_NIL,
  OP_TRUE,
  OP_FALSE,
  OP_CONSTANT_LONG,
  OP_NOT,
  OP_NEGATE,
  OP_POP,
  OP_GET_GLOBAL,
  OP_DEFINE_GLOBAL,
  OP_PRINT,
  OP_RETURN
} OpCode;

typedef struct
{
  int count;
  int capacity;
  ValueArray constants;
  uint8_t *code;
  int *lines;
} Chunk;

void initChunk(Chunk *chunk);
void freeChunk(Chunk *chunk);
void writeChunk(Chunk *chunk, uint8_t byte, int line);
int addConstant(Chunk *chunk, Value constant);
void writeConstant(Chunk *chunk, Value value, int line);

#endif