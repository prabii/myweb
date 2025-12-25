# Push to GitHub Instructions

## Step 1: Create GitHub Repository
1. Go to https://github.com/new
2. Create a new repository (e.g., `mechheaven-ecommerce`)
3. **DO NOT** initialize with README, .gitignore, or license
4. Click "Create repository"

## Step 2: Add Remote and Push

Run these commands (replace YOUR_USERNAME and YOUR_REPO_NAME):

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

## Alternative: If you already have a repository URL

```bash
git remote add origin YOUR_GITHUB_REPO_URL
git branch -M main
git push -u origin main
```

## Note
- Make sure you have GitHub credentials configured
- If using HTTPS, you may need a Personal Access Token
- If using SSH, make sure your SSH key is added to GitHub

