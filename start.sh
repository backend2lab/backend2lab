#!/bin/sh

echo "Starting Backend2Lab Server..."
cd /app/server && node dist/main.js &

echo "Starting Backend2Lab Client..."
cd /app/client || exit 1
npx http-server ./dist -a 0.0.0.0 -p 4200 --cache -1 &
wait
