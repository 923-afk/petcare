#!/bin/bash

# ============================================
# Vetcepi - GitHub Upload Script
# ============================================
# This script will help you upload your project to GitHub
# 
# BEFORE RUNNING:
# 1. Create a new repository on GitHub.com
# 2. Copy your repository URL
# 3. Replace YOUR_GITHUB_USERNAME and YOUR_REPO_NAME below
# ============================================

echo "🚀 Vetcepi GitHub Upload Script"
echo "================================"
echo ""

# Configuration - REPLACE THESE WITH YOUR VALUES
GITHUB_USERNAME="YOUR_GITHUB_USERNAME"
REPO_NAME="vetcepi"

echo "📋 Configuration:"
echo "   GitHub Username: $GITHUB_USERNAME"
echo "   Repository Name: $REPO_NAME"
echo ""

# Check if this is correct
read -p "Is this correct? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    echo "❌ Please edit this script and update GITHUB_USERNAME and REPO_NAME"
    exit 1
fi

echo ""
echo "🔍 Step 1: Checking git status..."
git status

echo ""
echo "📦 Step 2: Adding all files to git..."
git add .

echo ""
echo "📝 Step 3: Committing changes..."
git commit -m "Initial commit: Vetcepi Pet Care Management System

- Full-stack pet care management application
- React + TypeScript frontend with Vite
- Express + Node.js backend with demo data
- Features: Appointments, Patient Records, Inventory, Vaccinations
- Owner and Clinic dashboards with PetPalette design
- Demo data included for testing
- Comprehensive documentation
- Production-ready with deployment guides"

echo ""
echo "🔗 Step 4: Adding GitHub remote..."
git remote add origin "https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"

echo ""
echo "🌿 Step 5: Setting main branch..."
git branch -M main

echo ""
echo "🚀 Step 6: Pushing to GitHub..."
echo "   This may ask for your GitHub credentials..."
git push -u origin main

echo ""
echo "✅ Upload complete!"
echo ""
echo "🎉 Your repository is now available at:"
echo "   https://github.com/$GITHUB_USERNAME/$REPO_NAME"
echo ""
echo "📝 Next steps:"
echo "   1. Visit your repository on GitHub"
echo "   2. Add a description and topics"
echo "   3. Consider adding a LICENSE file"
echo "   4. Enable Issues for bug tracking"
echo ""
echo "🔗 Clone command for others:"
echo "   git clone https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"
echo ""

