#include "common.h"
#include "chunk.h"

int main(int argc, char *argv[])
{
  Chunk chunk;
  initChunk(&chunk);
  int constant = addConstant(&chunk, 1.2);
  writeChunk(&chunk, OP_CONSTANT, 1);
  writeChunk(&chunk, constant, 1);
  writeChunk(&chunk, OP_RETURN, 1);
  disassembleChunk(&chunk, "Test chunk");
  freeChunk(&chunk);

  return 0;
}