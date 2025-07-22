#!/bin/bash

BASIC_RED="\e[0;31m"
BASIC_GREEN="\e[0;32m"
BASIC_YELLOW="\e[0;33m"
BASIC_CYAN="\e[0;36m"
ENDCOLOR="\e[0m"

echo -e "${BASIC_CYAN}🚀 Running pre-push checks...${ENDCOLOR}"

echo -e "${BASIC_CYAN}🧪 Running unit and integration tests (npm test)...${ENDCOLOR}"
npm test
if [[ $? -ne 0 ]]; then
  echo -e "${BASIC_RED}❌ Pre-push tests failed!${ENDCOLOR}"
  echo -e "${BASIC_YELLOW}⚠️ Please fix the test failures before pushing.${ENDCOLOR}"
  exit 1
fi

echo -e "${BASIC_GREEN}✅ Pre-push checks passed successfully!${ENDCOLOR}"
exit 0
