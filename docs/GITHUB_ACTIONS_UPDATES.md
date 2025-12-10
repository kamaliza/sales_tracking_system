# GitHub Actions Updates

## Deprecated Actions Migration

### ✅ Updated: `actions/upload-artifact`

**Status**: Updated from v3 to v4

**Changes:**
- `actions/upload-artifact@v3` → `actions/upload-artifact@v4`
- Updated in CI workflow (2 instances)

**Breaking Changes in v4:**
- Requires Node.js 20+
- Different artifact compression
- Improved performance

**Migration Notes:**
- No code changes required
- Artifacts are backward compatible
- Better caching and performance

## Action Versions Used

### Current Versions

| Action | Version | Status |
|--------|---------|--------|
| `actions/checkout` | v4 | ✅ Current |
| `actions/setup-node` | v4 | ✅ Current |
| `actions/upload-artifact` | v4 | ✅ Updated |
| `docker/setup-buildx-action` | v3 | ✅ Current |
| `docker/build-push-action` | v5 | ✅ Current |
| `docker/metadata-action` | v5 | ✅ Current |
| `docker/login-action` | v3 | ✅ Current |
| `codecov/codecov-action` | v3 | ✅ Current |
| `github/codeql-action` | v2 | ✅ Current |
| `azure/setup-kubectl` | v3 | ✅ Current |
| `actions/create-release` | v1 | ⚠️ Deprecated (consider updating) |

### Deprecated Actions to Watch

1. **`actions/create-release@v1`** - Deprecated
   - Consider using `softprops/action-gh-release` or GitHub CLI
   - Used in CD pipeline for creating releases

## Update Checklist

- [x] Update `actions/upload-artifact` to v4
- [ ] Update `actions/create-release` (optional)
- [ ] Review other actions quarterly
- [ ] Monitor GitHub deprecation notices

## How to Update Actions

### Manual Update

1. Check action repository for latest version
2. Update version in workflow file
3. Test workflow
4. Commit changes

### Automated Update

Use Dependabot to automatically update actions:

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "monthly"
```

## Testing Updates

After updating actions:

1. Run workflow manually
2. Check for warnings/errors
3. Verify artifacts upload correctly
4. Test deployment if applicable

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Action Marketplace](https://github.com/marketplace?type=actions)
- [Deprecation Notices](https://github.blog/changelog/)

---

**Last Updated**: 2024

