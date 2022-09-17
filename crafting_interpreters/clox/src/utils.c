#include "utils.h"

/*
  This functions don't work fine yet
*/

TimeDebug initTimeDebug(char *label)
{
  TimeDebug timeDebug;
  timeDebug.label = label;
  timeDebug.time = time(NULL);
  return timeDebug;
}

void printTimeDebug(TimeDebug timeDebug)
{
  double elapsedTime = (double)time(NULL) - (double)timeDebug.time;
  printf("\n[%s] %f seconds\n", timeDebug.label, elapsedTime);
}