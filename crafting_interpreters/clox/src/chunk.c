#include <stdlib.h>
#include "memory.h"

#include "chunk.h"
#include "value.h"
#include "stdio.h"

void initChunk(Chunk *chunk)
{
  chunk->capacity = 0;
  chunk->count = 0;
  chunk->code = NULL;
  chunk->lines = NULL;
  initValueArray(&chunk->constants);
}

void freeChunk(Chunk *chunk)
{
  FREE_ARRAY(uint8_t, chunk->code, chunk->capacity);
  FREE_ARRAY(int, chunk->lines, chunk->capacity);
  freeValueArray(&chunk->constants);
  initChunk(chunk);
}

void writeChunk(Chunk *chunk, uint8_t byte, int line)
{
  if (chunk->capacity < chunk->count + 1)
  {
    int oldCapacity = chunk->capacity;
    chunk->capacity = GROW_CAPACITY(oldCapacity);
    chunk->code = GROW_ARRAY(uint8_t, chunk->code, oldCapacity, chunk->capacity);
    chunk->lines = GROW_ARRAY(int, chunk->lines, oldCapacity, chunk->capacity);
  }

  chunk->code[chunk->count] = byte;
  chunk->lines[chunk->count] = line;
  chunk->count++;
}

int addConstant(Chunk *chunk, Value value)
{
  writeValueArray(&chunk->constants, value);
  return chunk->constants.count - 1; // The index of the just appended constant
}

void writeConstant(Chunk *chunk, Value value, int line)
{
  int constant = addConstant(chunk, value);

  if (constant > MAX_CONSTANT_INDEX)
  {
    printf("Can use up to %d constants in clox\n", MAX_CONSTANT_INDEX);
    exit(1);
  }

  if (constant < 255)
  {
    writeChunk(chunk, OP_CONSTANT, line);
    writeChunk(chunk, constant, line);
  }
  else
  {
    writeChunk(chunk, OP_CONSTANT_LONG, line);
    writeChunk(chunk, constant & 0xff, line);
    writeChunk(chunk, (constant >> 8) & 0xff, line);
    writeChunk(chunk, (constant >> 16) & 0xff, line);
  }
}