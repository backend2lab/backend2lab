#!/bin/sh

echo "Starting Backend2Lab Server..."
cd /app/server && node dist/main.js &

echo "Starting Backend2Lab Client..."
cd /app/client && npx vite preview --host 0.0.0.0 --port 4200 &

wait
