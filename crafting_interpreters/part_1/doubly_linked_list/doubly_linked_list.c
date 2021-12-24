#include <stdio.h>
#include <stdlib.h>

typedef struct node
{
  int val;
  struct node *prev;
  struct node *next;
} node;

typedef struct doubly_linked_list
{
  node *first;
  node *last;
} doubly_linked_list;

typedef enum location
{
  first,
  last,
} location;

void insert(doubly_linked_list *dll, int val, location loc)
{
  switch (loc)
  {
  case first:
  {
    node *new = (node *)malloc(sizeof(node));
    new->val = val;
    new->next = NULL;
    if (dll->first)
    {
      dll->first->prev = new;
      node *tmp = dll->first;
      dll->first = new;
      dll->first->next = tmp;
    }
    else // list is empty
    {
      dll->first = new;
      dll->last = dll->first;
    }
    break;
  }
  case last:
  {
    node *new = (node *)malloc(sizeof(node));
    new->val = val;
    new->next = NULL;
    if (dll->last)
    {
      dll->last->prev->next = new;
      node *tmp = dll->last->prev; // Save the current penultimate node
      dll->last->prev = new;
      new->next = dll->last;
      new->prev = tmp;
    }
    else // list is empty
    {
      dll->last = new;
      dll->first = dll->last;
    }
    break;
  }
  default:
    break;
  }
}

// Starts from the first node
void print(doubly_linked_list *dll)
{
  node *root = dll->first;
  while (root)
  {
    printf("> %d\n", root->val);
    root = root->next;
  }
}

// Starts from the first node
void clear(doubly_linked_list *dll)
{
  while (dll->first)
  {
    node *tmp = dll->first->next;
    // printf("borrando %d\n", root->val);
    free(dll->first);
    dll->first = tmp;
  }
}

int assert(required, input)
{
  // printf("required: %d, input: %d\n", required, input);
  if (required == input)
  {
    printf("OK\n");
    return 1;
  }
  else
  {
    printf("ERROR => required: %d, input: %d\n", required, input);
    return 0;
  }
}

int main()
{
  doubly_linked_list *dll = (doubly_linked_list *)malloc(sizeof(doubly_linked_list));
  dll->first = NULL;
  dll->last = NULL;
  insert(dll, 1, first);
  insert(dll, 2, first);
  insert(dll, 3, first);
  insert(dll, 4, last);
  insert(dll, 0, first);
  insert(dll, 10, last);

  // TEST insert
  assert(0, dll->first->val);
  assert(3, dll->first->next->val);
  assert(2, dll->first->next->next->val);
  assert(4, dll->first->next->next->next->val);
  assert(10, dll->first->next->next->next->next->val);
  assert(1, dll->first->next->next->next->next->next->val);

  print(dll);

  clear(dll);

  // TEST clear
  assert(NULL, dll->first);

  free(dll);
}