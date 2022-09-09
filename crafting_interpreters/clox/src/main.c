#include "common.h"
#include "chunk.h"
#include "vm.h"

int main(int argc, char *argv[])
{
  initVM();

  Chunk chunk;
  initChunk(&chunk);

  for (int i = 0; i <= 2; i++)
  {
    writeConstant(&chunk, i, 1);
  }

  writeChunk(&chunk, OP_RETURN, 2);
  // disassembleChunk(&chunk, "Test chunk");
  interpret(&chunk);

  freeVM();

  freeChunk(&chunk);

  return 0;
}