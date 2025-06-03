#!/bin/bash

echo "📊 Checking Git status..."
echo "=========================="

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Not a git repository. Initializing..."
    git init
    echo "✅ Git repository initialized"
fi

# Show current status
echo "📋 Current Git Status:"
git status

echo ""
echo "📝 Files to be committed:"
git diff --name-only

echo ""
echo "🌿 Current branch:"
git branch --show-current

echo ""
echo "🔗 Remote repositories:"
git remote -v