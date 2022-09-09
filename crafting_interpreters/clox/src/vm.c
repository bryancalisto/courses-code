#include "common.h"
#include "vm.h"
#include "stdio.h"
#include "debug.h"

VM vm;

static void resetStack()
{
  vm.stackTop = vm.stack;
}

void initVM()
{
  resetStack();
}

void freeVM() {}

void push(Value value)
{
  *vm.stackTop = value;
  vm.stackTop++;
}

Value pop()
{
  return *(--vm.stackTop);
}

InterpretResult interpret(Chunk *chunk)
{
  vm.chunk = chunk;
  vm.ip = chunk->code;
  return run();
}

static InterpretResult run()
{
#define READ_BYTE() (*vm.ip++)
#define READ_CONSTANT() (vm.chunk->constants.values[READ_BYTE()])

  for (;;)
  {
#ifdef DEBUG_TRACE_EXECUTION
    disassembleInstruction(vm.chunk, (int)(vm.ip - vm.chunk->code));
#endif

    uint8_t instruction;
    switch (instruction = READ_BYTE())
    {
    case OP_CONSTANT:
      Value constant = READ_CONSTANT();
      printValue(constant);
      printf("\n");
      break;
    case OP_RETURN:
      return INTERPRET_OK;
    default:
      return INTERPRET_RUNTIME_ERROR;
    }
  }

#undef READ_BYTE
#undef READ_CONSTANT
}