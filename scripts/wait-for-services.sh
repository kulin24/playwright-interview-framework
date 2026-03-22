#!/bin/bash
# Wait for services to be ready before running tests

echo "Waiting for services to be ready..."

# Wait for API to be ready
max_retries=30
count=0

while [ $count -lt $max_retries ]; do
  if curl -s -f https://jsonplaceholder.typicode.com/posts/1 > /dev/null 2>&1; then
    echo "✅ API is ready"
    break
  fi
  echo "Waiting for API... ($count/$max_retries)"
  sleep 2
  count=$((count+1))
done

# Wait for UI to be ready (if needed)
# Similar logic for your app

echo "All services ready!"
