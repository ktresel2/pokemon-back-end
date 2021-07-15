#!/bin/sh

API="http://localhost:4741"
URL_PATH="/pokemon"

curl "${API}${URL_PATH}/${POKEID}" \
  --include \
  --request GET \

echo
