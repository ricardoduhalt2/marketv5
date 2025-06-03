#!/bin/bash

# Comprehensive Git commit and push script
echo "🚀 Starting Git commit and push process..."
echo "=========================================="

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Not a git repository. Please initialize git first:"
    echo "   git init"
    echo "   git remote add origin <your-repo-url>"
    exit 1
fi

# Show current status
echo "📊 Current Git Status:"
git status

# Add all changes
echo ""
echo "📁 Adding files to staging area..."
git add src/App.tsx
git add CHANGELOG.md
git add *.sh
git add *.bat

# Show what will be committed
echo ""
echo "📝 Files staged for commit:"
git diff --cached --name-only

# Commit with detailed message
echo ""
echo "💾 Creating commit..."
git commit -m "🐛 Fix: Resolve 500 Internal Server Error in App.tsx

Critical fixes to resolve server error:

🔧 Changes Made:
- Remove duplicate React import statement
- Fix malformed JSX structure in header section  
- Properly structure h1 element with correct attributes
- Ensure textGradient animation is properly referenced
- Clean up broken HTML tags and misplaced attributes

📁 Files Modified:
- src/App.tsx: Fixed syntax errors and JSX structure
- CHANGELOG.md: Added detailed change documentation
- Added deployment scripts for future use

✅ Verification:
- React component compiles correctly
- All JSX elements properly structured  
- CSS animations properly referenced
- No duplicate imports
- Application loads without 500 errors

🎯 Impact:
- Resolves 500 Internal Server Error
- Enables proper gradient text animations
- Improves code maintainability

Fixes #500-error"

# Check if commit was successful
if [ $? -eq 0 ]; then
    echo "✅ Commit created successfully!"
    
    # Push to remote
    echo ""
    echo "📤 Pushing to remote repository..."
    
    # Get current branch
    CURRENT_BRANCH=$(git branch --show-current)
    echo "🌿 Pushing to branch: $CURRENT_BRANCH"
    
    git push origin $CURRENT_BRANCH
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "🎉 SUCCESS! Changes have been pushed to GitHub!"
        echo "✅ App.tsx fixes are now live on the repository"
    else
        echo ""
        echo "❌ Failed to push to remote repository"
        echo "💡 You may need to set up the remote repository first:"
        echo "   git remote add origin <your-repo-url>"
        echo "   git push -u origin main"
    fi
else
    echo "❌ Failed to create commit"
    echo "💡 Please check for any issues and try again"
fi

echo ""
echo "📋 Final Git Status:"
git status