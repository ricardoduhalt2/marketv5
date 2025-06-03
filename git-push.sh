#!/bin/bash

# Git commit and push script for App.tsx fixes

echo "🔧 Committing fixes for App.tsx..."

# Add the fixed App.tsx file
git add src/App.tsx

# Commit with a descriptive message
git commit -m "🐛 Fix: Resolve 500 Internal Server Error in App.tsx

- Remove duplicate React import statement
- Fix malformed JSX structure in header section
- Properly structure h1 element with correct attributes
- Ensure textGradient animation is properly referenced
- Clean up broken HTML tags and misplaced attributes

Fixes #500-error"

# Push to the main branch
echo "📤 Pushing changes to GitHub..."
git push origin main

echo "✅ Changes successfully pushed to GitHub!"