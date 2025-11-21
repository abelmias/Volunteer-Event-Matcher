# Git Branching Strategy

**Project:** Volunteer Event Matcher  
**Strategy:** Git Flow (simplified for small team)

---

## 📋 Branch Structure

```
main (production-ready)
  ↑
  └── develop (integration branch)
        ↑
        ├── feature/sprint0-setup
        ├── feature/auth
        ├── feature/event-crud
        ├── feature/helper-features
        ├── feature/map-integration
        └── bugfix/issue-name
```

---

## 🔄 Branch Types & Naming Conventions

### Main Branches (Protected)

| Branch | Purpose | Protection |
|---|---|---|
| **main** | Production-ready code | ✅ Protected - PR required |
| **develop** | Integration branch for features | ✅ Protected - PR required |

### Feature Branches

**Naming:** `feature/descriptive-name`

**Examples:**
- `feature/sprint0-setup`
- `feature/user-authentication`
- `feature/event-crud-operations`
- `feature/admin-dashboard`
- `feature/helper-collection`
- `feature/commit-api`
- `feature/map-integration`
- `feature/proximity-search`

**Lifetime:** Created from `develop`, merged back to `develop` via PR

### Bugfix Branches

**Naming:** `bugfix/issue-description`

**Examples:**
- `bugfix/slot-decrement-error`
- `bugfix/auth-token-expiry`
- `bugfix/map-marker-display`

**Lifetime:** Created from `develop`, merged back to `develop` via PR

### Hotfix Branches (if needed)

**Naming:** `hotfix/issue-description`

**Lifetime:** Created from `main`, merged to both `main` and `develop`

---

## 📝 Workflow: Creating a Feature

### Step 1: Create Feature Branch
```bash
# Make sure you're on develop and up-to-date
git checkout develop
git pull origin develop

# Create feature branch
git checkout -b feature/your-feature-name

# Push to GitHub
git push -u origin feature/your-feature-name
```

### Step 2: Work on Feature
```bash
# Make changes and commit regularly
git add .
git commit -m "FEAT(scope): description"

# Push frequently
git push origin feature/your-feature-name
```

### Step 3: Create Pull Request
1. Go to GitHub
2. Click "Compare & pull request"
3. Set base: `develop`, compare: `feature/your-feature-name`
4. Add description of changes
5. Request review (if team member available)
6. Merge when approved

### Step 4: Delete Feature Branch
```bash
# Delete locally
git branch -d feature/your-feature-name

# Delete on GitHub
git push origin --delete feature/your-feature-name

# Switch back to develop
git checkout develop
git pull origin develop
```

---

## 🔀 Workflow: Merging to Main

**Only after Sprint 4 is complete:**

```bash
# Create release branch (optional)
git checkout -b release/v1.0 develop

# Merge to main
git checkout main
git pull origin main
git merge --no-ff release/v1.0
git tag -a v1.0 -m "Release version 1.0"
git push origin main --tags

# Merge back to develop
git checkout develop
git merge --no-ff release/v1.0
git push origin develop

# Delete release branch
git branch -d release/v1.0
git push origin --delete release/v1.0
```

---

## ✅ Best Practices

### Do's ✅
- ✅ Create a new branch for each feature/bugfix
- ✅ Keep branches focused on one task
- ✅ Push frequently to GitHub
- ✅ Create descriptive commit messages
- ✅ Keep branches up-to-date with develop
- ✅ Delete branches after merging
- ✅ Use PRs for code review

### Don'ts ❌
- ❌ Commit directly to `main` or `develop`
- ❌ Create branches from `main` (except hotfixes)
- ❌ Leave stale branches unmerged
- ❌ Force push to shared branches
- ❌ Mix multiple features in one branch
- ❌ Commit without clear messages

---

## 🔄 Keeping Branches Updated

If `develop` has new commits while you're working:

```bash
# Fetch latest changes
git fetch origin

# Rebase your branch on latest develop
git rebase origin/develop

# If conflicts occur, resolve them, then:
git add .
git rebase --continue

# Force push your branch (only to your own feature branch!)
git push origin feature/your-feature-name --force-with-lease
```

---

## 📊 Sprint Branching Plan

| Sprint | Feature Branches | Merge to Develop |
|---|---|---|
| **Sprint 0** | `feature/sprint0-setup` | End of Sprint 0 |
| **Sprint 1** | `feature/auth`, `feature/event-crud`, `feature/admin-ui` | End of Sprint 1 |
| **Sprint 2** | `feature/helper-features`, `feature/commit-api` | End of Sprint 2 |
| **Sprint 3** | `feature/map-integration`, `feature/proximity-search` | End of Sprint 3 |
| **Sprint 4** | `bugfix/*` (as needed) | End of Sprint 4 |

---

## 🔍 Viewing Branches

```bash
# List local branches
git branch

# List remote branches
git branch -r

# List all branches
git branch -a

# Show branch with last commit
git branch -v

# Delete local branch
git branch -d branch-name

# Delete remote branch
git push origin --delete branch-name
```

---

## 📌 Important Commands

```bash
# Check current branch
git branch

# Switch branch
git checkout branch-name

# Create and switch to new branch
git checkout -b new-branch-name

# Merge branch into current branch
git merge branch-name

# View merge history
git log --oneline --graph --all

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1
```

---

## 🎯 Summary

**Key Points:**
- Always work on feature branches
- Never commit directly to `main` or `develop`
- Use PRs for all merges
- Follow naming conventions
- Keep commits focused and well-described
- Delete branches after merging

---

**Last Updated:** [Date]
