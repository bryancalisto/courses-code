#include "common.h"
#include "vm.h"
#include "stdio.h"
#include "compiler.h"
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

static InterpretResult run()
{
#define READ_BYTE() (*vm.ip++)
#define READ_CONSTANT() (vm.chunk->constants.values[READ_BYTE()])
// do-while is a trick to use multiple statements in a block without issues like if () double b = pop(); double a = pop().
// where only the first statement would be attatched to the if.
#define BINARY_OP(op) \
  do                  \
  {                   \
    double b = pop(); \
    double a = pop(); \
    push(a op b);     \
  } while (false)

  for (;;)
  {
#ifdef DEBUG_TRACE_EXECUTION
    disassembleInstruction(vm.chunk, (int)(vm.ip - vm.chunk->code));

    printf("     ");

    for (Value *slot = vm.stack; slot < vm.stackTop; slot++)
    {
      printf("[ ");
      printValue(*slot);
      printf(" ]");
    }

    printf("\n");
#endif

    uint8_t instruction;
    switch (instruction = READ_BYTE())
    {
    case OP_ADD:
      BINARY_OP(+);
      break;
    case OP_SUBTRACT:
      BINARY_OP(-);
      break;
    case OP_MULTIPLY:
      BINARY_OP(*);
      break;
    case OP_DIVIDE:
      BINARY_OP(/);
      break;
    case OP_CONSTANT:
      Value constant = READ_CONSTANT();
      push(constant);
      break;
    case OP_NEGATE:
      *(vm.stackTop - 1) = *(vm.stackTop - 1) * -1;
      break;
    case OP_RETURN:
      printValue(pop());
      return INTERPRET_OK;
    default:
      return INTERPRET_RUNTIME_ERROR;
    }
  }

#undef BINARY_OP
#undef READ_BYTE
#undef READ_CONSTANT
}

InterpretResult interpret(Chunk *chunk)
{
  vm.chunk = chunk;
  vm.ip = chunk->code;
  return run();
}