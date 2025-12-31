# Git Branch Commands

## Create and Push a New Branch

### Step 1: Pull latest changes first (IMPORTANT!)
```bash
git pull origin main
```
or if you're on a different branch:
```bash
git pull origin <current-branch-name>
```

### Step 2: Create a new branch
```bash
git checkout -b <branch-name>
```

Examples:
```bash
git checkout -b fix/mobile-ui-improvements
git checkout -b feature/new-feature-name
git checkout -b fix/bug-description
```

### Step 3: Push the branch to remote
```bash
git push -u origin <branch-name>
```

The `-u` flag sets up tracking so you can just use `git push` later.

---

## Complete Workflow Example

```bash
# 1. Pull latest changes
git pull origin main

# 2. Create new branch
git checkout -b fix/mobile-ui-improvements

# 3. Make your changes, then stage them
git add .

# 4. Commit your changes
git commit -m "Description of what you changed"

# 5. Push the branch
git push -u origin fix/mobile-ui-improvements
```

---

## Daily Workflow (Stay Updated)

### When starting work:
```bash
# Pull latest changes from main
git checkout main
git pull origin main

# Switch to your branch
git checkout <your-branch-name>

# Merge latest main into your branch
git merge main
```

### Or use rebase (cleaner history):
```bash
git checkout <your-branch-name>
git pull --rebase origin main
```

---

## Common Commands

### Check current branch
```bash
git branch
```

### See all branches (local and remote)
```bash
git branch -a
```

### Switch to a branch
```bash
git checkout <branch-name>
```

### Delete a local branch
```bash
git branch -d <branch-name>
```

### Delete a remote branch
```bash
git push origin --delete <branch-name>
```

---

## Quick Reference

```bash
# Pull before starting
git pull origin main

# Create branch
git checkout -b <branch-name>

# Make changes, then:
git add .
git commit -m "Your commit message"
git push -u origin <branch-name>

# To update your branch with latest main:
git pull --rebase origin main
```

