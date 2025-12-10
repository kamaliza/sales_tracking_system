# Setup Instructions

## Initial Setup

### 1. Update package-lock.json

After adding new dependencies (like `prom-client`), you need to update the lock file:

```bash
cd backend
npm install
git add package-lock.json
git commit -m "chore: update package-lock.json"
```

### 2. GitHub Actions Configuration

The CI workflow uses `npm install` instead of `npm ci` to handle lock file updates. Once your lock file is in sync, you can switch back to `npm ci` for faster installs.

### 3. Docker Build Context

The Docker build commands in the CI workflow use explicit paths:
- Backend: `-f backend/Dockerfile backend`
- Frontend: `-f frontend/Dockerfile frontend`

This ensures the build context is correct regardless of the working directory.

## Troubleshooting

### npm ci fails with "lock file out of sync"

**Solution**: Run `npm install` to update the lock file, then commit it.

### Docker build fails with "path not found"

**Solution**: Ensure the Dockerfile paths in the workflow use `-f` flag to specify the Dockerfile location explicitly.

### Missing dependencies

**Solution**: 
1. Add dependency to `package.json`
2. Run `npm install` to update `package-lock.json`
3. Commit both files

## Next Steps

1. Run `npm install` in the backend directory
2. Commit the updated `package-lock.json`
3. Push to trigger CI pipeline
4. Verify the pipeline runs successfully

