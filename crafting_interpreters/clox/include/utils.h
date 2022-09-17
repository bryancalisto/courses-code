#ifndef CLOX_UTILS_H
#define CLOX_UTILS_H

#include <time.h>
#include <stdio.h>

typedef struct
{
  time_t time;
  char *label;
} TimeDebug;

TimeDebug initTimeDebug(char *label);
void printTimeDebug(TimeDebug timeDebug);

#endif