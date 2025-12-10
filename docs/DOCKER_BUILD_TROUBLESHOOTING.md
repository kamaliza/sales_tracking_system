# Docker Build Troubleshooting

## Common Issues and Solutions

### Issue: `npm ci` fails with "package.json and package-lock.json are out of sync"

**Error Message:**
```
npm error `npm ci` can only install packages when your package.json and package-lock.json or npm-shrinkwrap.json are in sync.
npm error Missing: prom-client@15.1.3 from lock file
```

**Cause:**
- Dependencies were added to `package.json` but `package-lock.json` wasn't updated
- Lock file is out of sync with package.json

**Solution:**

1. **Update package-lock.json locally:**
   ```bash
   cd backend
   npm install
   git add package-lock.json
   git commit -m "chore: update package-lock.json"
   ```

2. **Temporary fix in Dockerfile:**
   - Changed from `npm ci` to `npm install` in Dockerfiles
   - This allows builds to succeed even with out-of-sync lock files
   - **Note**: This is less strict than `npm ci` and may install different versions

3. **Best Practice:**
   - Always commit `package-lock.json` after adding dependencies
   - Use `npm ci` in production Dockerfiles for reproducible builds
   - Update lock files before pushing to CI/CD

### Issue: Docker build context is too large

**Error Message:**
```
#7 transferring context: 28.77MB 1.0s done
```

**Cause:**
- Large files in build context
- `node_modules` included in context
- Unnecessary files copied

**Solution:**

1. **Use .dockerignore:**
   ```dockerignore
   node_modules
   npm-debug.log
   .env
   coverage
   .git
   *.test.js
   ```

2. **Optimize Dockerfile:**
   - Copy `package*.json` first
   - Install dependencies
   - Then copy source code
   - This leverages Docker layer caching

### Issue: Image size too large

**Solution:**

1. **Use multi-stage builds:**
   ```dockerfile
   FROM node:18-alpine AS builder
   # ... build steps ...
   
   FROM node:18-alpine
   COPY --from=builder /app/dist ./dist
   ```

2. **Use Alpine base images:**
   ```dockerfile
   FROM node:18-alpine
   ```

3. **Clean npm cache:**
   ```dockerfile
   RUN npm install && npm cache clean --force
   ```

4. **Remove unnecessary files:**
   - Use `.dockerignore`
   - Don't copy test files
   - Don't copy documentation

### Issue: Build fails in CI but works locally

**Possible Causes:**

1. **Different Node.js versions:**
   - CI uses Node 18
   - Local might use different version
   - **Fix**: Use `.nvmrc` or specify version in Dockerfile

2. **Missing environment variables:**
   - CI might not have required env vars
   - **Fix**: Provide defaults in Dockerfile or CI config

3. **Platform differences:**
   - CI runs on Linux
   - Local might be macOS/Windows
   - **Fix**: Use Docker Buildx for multi-platform builds

### Issue: npm install is slow in Docker

**Solution:**

1. **Use npm cache:**
   ```dockerfile
   RUN npm install --prefer-offline --no-audit
   ```

2. **Use BuildKit cache:**
   ```yaml
   cache-from: type=gha
   cache-to: type=gha,mode=max
   ```

3. **Use .npmrc for registry:**
   ```dockerfile
   COPY .npmrc ./
   RUN npm install
   ```

### Issue: Health check fails

**Error:**
```
HEALTHCHECK failed
```

**Solution:**

1. **Verify health endpoint exists:**
   ```bash
   curl http://localhost:5000/health
   ```

2. **Adjust health check:**
   ```dockerfile
   HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
     CMD node -e "require('http').get('http://localhost:5000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"
   ```

3. **Increase start period:**
   - Some apps need more time to start
   - Increase `--start-period` value

## Best Practices

### 1. Always Update Lock Files
```bash
# After adding dependencies
npm install
git add package-lock.json
git commit -m "chore: update dependencies"
```

### 2. Use npm ci in Production
```dockerfile
# Preferred for production
RUN npm ci --omit=dev
```

### 3. Use .dockerignore
Create `.dockerignore` to exclude:
- `node_modules`
- `.git`
- Test files
- Documentation
- CI/CD files

### 4. Multi-Stage Builds
```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
CMD ["node", "dist/index.js"]
```

### 5. Layer Caching
Order Dockerfile commands from least to most frequently changing:
1. Install OS packages
2. Copy package files
3. Install dependencies
4. Copy source code
5. Build application

## Quick Reference

| Command | Use Case |
|---------|----------|
| `npm ci` | Production builds (requires sync lock file) |
| `npm install` | Development or when lock file is out of sync |
| `npm ci --omit=dev` | Production dependencies only |
| `npm install --omit=dev` | Production dependencies (less strict) |

## Verification Commands

```bash
# Check if lock file is in sync
npm ci --dry-run

# Verify Docker build
docker build -t test-image .

# Check image size
docker images test-image

# Test container
docker run -p 5000:5000 test-image

# Check health
curl http://localhost:5000/health
```

---

**Last Updated**: 2024

