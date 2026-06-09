#!/bin/bash
while true; do
  fuser -k 3000/tcp 2>/dev/null
  sleep 1
  bun run next dev -p 3000 2>&1
  echo "Server died, restarting in 3s..."
  sleep 3
done
