# Git Workflow & Branching Strategy

## Branching Strategy

We follow the **Git Flow** model with the following branches:

### Main Branches

1. **`main`** (Production)
   - Always deployable
   - Protected branch (requires PR + approvals)
   - Only merged from `develop` or hotfix branches
   - Tagged with version numbers (semantic versioning)

2. **`develop`** (Development/Staging)
   - Integration branch for features
   - Protected branch (requires PR)
   - Deployed to staging environment
   - Merged to `main` for releases

### Supporting Branches

3. **`feature/*`** (Feature branches)
   - Created from `develop`
   - Naming: `feature/feature-name` (e.g., `feature/add-user-authentication`)
   - Merged back to `develop` via PR
   - Deleted after merge

4. **`bugfix/*`** (Bug fixes)
   - Created from `develop`
   - Naming: `bugfix/issue-description` (e.g., `bugfix/fix-sales-calculation`)
   - Merged back to `develop` via PR

5. **`hotfix/*`** (Critical production fixes)
   - Created from `main`
   - Naming: `hotfix/issue-description` (e.g., `hotfix/security-patch`)
   - Merged to both `main` and `develop`
   - Used for urgent production fixes

6. **`release/*`** (Release preparation)
   - Created from `develop`
   - Naming: `release/v1.0.0`
   - Used for final testing before production
   - Merged to `main` and `develop`

## Workflow Diagram

```
main ──────────────●───────────────●───────────────
                    │               │
                    │               │
develop ──────●─────┴─────●─────────┴─────●───────
              │           │                 │
              │           │                 │
feature/   ───┘           │                 │
bugfix/                   └─────────────────┘
```

## Commit Message Standards

We follow the **Conventional Commits** specification:

### Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- **feat:** New feature
- **fix:** Bug fix
- **docs:** Documentation changes
- **style:** Code style changes (formatting, semicolons, etc.)
- **refactor:** Code refactoring
- **test:** Adding or updating tests
- **chore:** Maintenance tasks, dependency updates
- **perf:** Performance improvements
- **ci:** CI/CD changes
- **build:** Build system changes

### Examples

```
feat(backend): add sales analytics endpoint

Implemented GET /api/sales/analytics endpoint that returns
monthly sales statistics with filtering options.

Closes #123
```

```
fix(frontend): resolve memory leak in SalesList component

Fixed issue where event listeners were not properly cleaned up
on component unmount, causing memory leaks.

Fixes #456
```

```
docs(readme): update deployment instructions

Added Kubernetes deployment steps and updated Docker commands.
```

## Pull Request Process

### Creating a PR

1. **Create feature branch** from `develop`
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/my-feature
   ```

2. **Make changes and commit**
   ```bash
   git add .
   git commit -m "feat(scope): description"
   ```

3. **Push and create PR**
   ```bash
   git push origin feature/my-feature
   ```
   Then create PR on GitHub targeting `develop`

### PR Requirements

- [ ] All CI checks pass
- [ ] Code coverage maintained/improved
- [ ] At least 1 approval from code owner
- [ ] No merge conflicts
- [ ] PR description filled out
- [ ] Related issues linked

### PR Review Guidelines

**Reviewers should check:**
- Code quality and style
- Test coverage
- Documentation updates
- Security considerations
- Performance implications
- Error handling

**Reviewers should:**
- Be constructive and respectful
- Respond within 24 hours
- Approve or request changes (not just comment)
- Test locally if significant changes

## Branch Protection Rules

### `main` Branch
- ✅ Require pull request reviews (1 approval minimum)
- ✅ Require status checks to pass
- ✅ Require branches to be up to date
- ✅ Require linear history
- ✅ Do not allow force pushes
- ✅ Do not allow deletions

### `develop` Branch
- ✅ Require pull request reviews (1 approval minimum)
- ✅ Require status checks to pass
- ✅ Do not allow force pushes

## Release Process

### Creating a Release

1. **Create release branch**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b release/v1.0.0
   ```

2. **Update version numbers**
   - Update `package.json` versions
   - Update CHANGELOG.md

3. **Final testing**
   - Run all tests
   - Deploy to staging
   - Perform smoke tests

4. **Merge to main**
   ```bash
   git checkout main
   git merge release/v1.0.0
   git tag -a v1.0.0 -m "Release version 1.0.0"
   git push origin main --tags
   ```

5. **Merge back to develop**
   ```bash
   git checkout develop
   git merge release/v1.0.0
   git push origin develop
   ```

## Hotfix Process

### Creating a Hotfix

1. **Create hotfix branch from main**
   ```bash
   git checkout main
   git pull origin main
   git checkout -b hotfix/critical-bug-fix
   ```

2. **Make fix and commit**
   ```bash
   git add .
   git commit -m "fix(scope): critical bug fix"
   ```

3. **Merge to main**
   ```bash
   git checkout main
   git merge hotfix/critical-bug-fix
   git tag -a v1.0.1 -m "Hotfix version 1.0.1"
   git push origin main --tags
   ```

4. **Merge to develop**
   ```bash
   git checkout develop
   git merge hotfix/critical-bug-fix
   git push origin develop
   ```

## Best Practices

1. **Keep branches up to date**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout feature/my-feature
   git rebase develop  # or git merge develop
   ```

2. **Write clear commit messages**
   - Use imperative mood ("add" not "added")
   - Keep subject line < 50 characters
   - Explain "what" and "why" in body

3. **Commit often**
   - Small, logical commits
   - One logical change per commit

4. **Don't commit**
   - Secrets or credentials
   - Large binary files
   - Generated files (unless necessary)
   - Temporary files

5. **Use .gitignore**
   - Keep it updated
   - Don't force-add ignored files

## Useful Commands

```bash
# View branch structure
git log --oneline --graph --all

# Check which branch you're on
git branch

# List all branches (including remote)
git branch -a

# Delete local branch
git branch -d feature/my-feature

# Delete remote branch
git push origin --delete feature/my-feature

# Stash changes
git stash
git stash pop

# View commit history
git log --oneline --graph --decorate
```

---

**Last Updated:** 2024

