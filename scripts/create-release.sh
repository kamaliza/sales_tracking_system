#!/bin/bash
# Create a new release with versioning and tagging

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get version type from argument
VERSION_TYPE=${1:-patch}

if [[ ! "$VERSION_TYPE" =~ ^(major|minor|patch)$ ]]; then
  echo -e "${RED}Error: Invalid version type. Use: major, minor, or patch${NC}"
  exit 1
fi

echo -e "${YELLOW}Creating release...${NC}"

# Get current version
CURRENT_VERSION=$(node -p "require('./backend/package.json').version")
echo -e "Current version: ${GREEN}$CURRENT_VERSION${NC}"

# Calculate new version
IFS='.' read -ra VERSION_PARTS <<< "$CURRENT_VERSION"
MAJOR=${VERSION_PARTS[0]}
MINOR=${VERSION_PARTS[1]}
PATCH=${VERSION_PARTS[2]}

case $VERSION_TYPE in
  major)
    MAJOR=$((MAJOR + 1))
    MINOR=0
    PATCH=0
    ;;
  minor)
    MINOR=$((MINOR + 1))
    PATCH=0
    ;;
  patch)
    PATCH=$((PATCH + 1))
    ;;
esac

NEW_VERSION="$MAJOR.$MINOR.$PATCH"
TAG_NAME="v$NEW_VERSION"

echo -e "New version: ${GREEN}$NEW_VERSION${NC}"
echo -e "Tag name: ${GREEN}$TAG_NAME${NC}"

# Update version in package.json files
echo -e "${YELLOW}Updating version in package.json files...${NC}"
node -e "const fs=require('fs');const pkg=JSON.parse(fs.readFileSync('backend/package.json'));pkg.version='$NEW_VERSION';fs.writeFileSync('backend/package.json',JSON.stringify(pkg,null,2));"
node -e "const fs=require('fs');const pkg=JSON.parse(fs.readFileSync('frontend/package.json'));pkg.version='$NEW_VERSION';fs.writeFileSync('frontend/package.json',JSON.stringify(pkg,null,2));"

# Update CHANGELOG.md
echo -e "${YELLOW}Updating CHANGELOG.md...${NC}"
TODAY=$(date +%Y-%m-%d)
sed -i.bak "s/## \[Unreleased\]/## \[Unreleased\]\n\n## \[$NEW_VERSION\] - $TODAY/" CHANGELOG.md
rm -f CHANGELOG.md.bak

# Commit changes
echo -e "${YELLOW}Committing version changes...${NC}"
git add backend/package.json frontend/package.json CHANGELOG.md
git commit -m "chore: bump version to $NEW_VERSION" || echo "No changes to commit"

# Create tag
echo -e "${YELLOW}Creating git tag...${NC}"
git tag -a "$TAG_NAME" -m "Release version $NEW_VERSION"

echo -e "${GREEN}Release created successfully!${NC}"
echo -e "${YELLOW}Next steps:${NC}"
echo -e "  1. Review changes: ${GREEN}git log${NC}"
echo -e "  2. Push commits: ${GREEN}git push origin develop${NC}"
echo -e "  3. Push tags: ${GREEN}git push origin $TAG_NAME${NC}"
echo -e "  4. Create release on GitHub or let CI/CD handle it"

