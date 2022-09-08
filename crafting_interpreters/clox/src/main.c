#include "common.h"
#include "chunk.h"

int main(int argc, char *argv[])
{
  Chunk chunk;
  initChunk(&chunk);

  for (int i = 0; i <= 257; i++)
  {
    writeConstant(&chunk, i, 1);
  }

  writeChunk(&chunk, OP_RETURN, 1);
  disassembleChunk(&chunk, "Test chunk");
  freeChunk(&chunk);

  return 0;
}