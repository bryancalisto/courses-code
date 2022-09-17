#include "common.h"
#include "chunk.h"
#include "vm.h"
#include <time.h>
#include "utils.h"

int main(int argc, char *argv[])
{
  TimeDebug programTime = initTimeDebug("main");

  initVM();

  Chunk chunk;
  initChunk(&chunk);

  writeConstant(&chunk, 3.4, 1);
  writeConstant(&chunk, 5.6, 1);
  writeChunk(&chunk, OP_ADD, 1);
  writeConstant(&chunk, 2, 1);
  writeChunk(&chunk, OP_DIVIDE, 2);
  writeChunk(&chunk, OP_NEGATE, 2);
  writeChunk(&chunk, OP_RETURN, 2);

  interpret(&chunk);

  freeVM();

  freeChunk(&chunk);

  printTimeDebug(programTime);
  return 0;
}