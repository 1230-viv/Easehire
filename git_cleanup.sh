#!/bin/bash
# Git cleanup and setup script for EaseHire project

echo "🧹 Git Repository Cleanup & Setup"
echo "=================================="

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Not a git repository. Run 'git init' first."
    exit 1
fi

# Remove sensitive files from git if they were accidentally added
echo "🔐 Removing sensitive files from git history..."
git rm --cached .env 2>/dev/null || echo "✅ .env not in git"
git rm -r --cached myenv/ 2>/dev/null || echo "✅ Virtual environment not in git"
git rm -r --cached __pycache__/ 2>/dev/null || echo "✅ Python cache not in git"
git rm -r --cached frontend/node_modules/ 2>/dev/null || echo "✅ Node modules not in git"

# Add important files
echo "📝 Adding project files..."
git add .gitignore .env.example README.md
git add *.py requirement.txt setup_llm.sh
git add frontend/src/ frontend/public/ frontend/package.json

# Check status
echo ""
echo "📊 Current Git Status:"
git status --short

echo ""
echo "✅ Git cleanup complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Review staged files: git status"
echo "2. Commit changes: git commit -m 'Add LLM improvements and gitignore'"
echo "3. Push to repository: git push"
echo ""
echo "🔑 Don't forget to:"
echo "- Copy .env.example to .env"
echo "- Add your actual API keys to .env"
echo "- Never commit .env to git!"
