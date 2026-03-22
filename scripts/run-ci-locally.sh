#!/bin/bash
# Simulate CI environment locally

echo "🔧 Running CI checks locally..."
export CI=true

echo "📝 Running TypeScript check..."
npx tsc --noEmit
if [ $? -ne 0 ]; then
  echo "❌ TypeScript check failed!"
  exit 1
fi
echo "✅ TypeScript check passed!"

echo "🔥 Running smoke tests..."
npx playwright test --grep @smoke --workers=2
if [ $? -ne 0 ]; then
  echo "❌ Smoke tests failed!"
  exit 1
fi
echo "✅ Smoke tests passed!"

echo "✅ All CI checks passed!"
