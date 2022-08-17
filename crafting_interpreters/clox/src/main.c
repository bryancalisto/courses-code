#include "common.h"
#include "chunk.h"

int main(int argc, char *argv[])
{
  Chunk chunk;
  initChunk(&chunk);
  writeChunk(&chunk, OP_RETURN);
  disassembleChunk(&chunk, "Test chunk");
  freeChunk(&chunk);

  return 0;
}