#!/bin/bash
# Version management script for semantic versioning

# Get current version from package.json
get_version() {
  if [ -f "package.json" ]; then
    node -p "require('./package.json').version"
  elif [ -f "backend/package.json" ]; then
    node -p "require('./backend/package.json').version"
  else
    echo "1.0.0"
  fi
}

# Bump version
bump_version() {
  local type=$1  # major, minor, patch
  local current_version=$(get_version)
  
  # Split version into parts
  IFS='.' read -ra VERSION_PARTS <<< "$current_version"
  MAJOR=${VERSION_PARTS[0]}
  MINOR=${VERSION_PARTS[1]}
  PATCH=${VERSION_PARTS[2]}
  
  case $type in
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
    *)
      echo "Invalid version type. Use: major, minor, or patch"
      exit 1
      ;;
  esac
  
  NEW_VERSION="$MAJOR.$MINOR.$PATCH"
  echo "$NEW_VERSION"
}

# Update version in package.json files
update_version() {
  local version=$1
  
  # Update backend package.json
  if [ -f "backend/package.json" ]; then
    node -e "const fs=require('fs');const pkg=JSON.parse(fs.readFileSync('backend/package.json'));pkg.version='$version';fs.writeFileSync('backend/package.json',JSON.stringify(pkg,null,2));"
  fi
  
  # Update frontend package.json
  if [ -f "frontend/package.json" ]; then
    node -e "const fs=require('fs');const pkg=JSON.parse(fs.readFileSync('frontend/package.json'));pkg.version='$version';fs.writeFileSync('frontend/package.json',JSON.stringify(pkg,null,2));"
  fi
  
  echo "Version updated to $version"
}

# Main script
if [ "$1" == "bump" ]; then
  TYPE=${2:-patch}
  NEW_VERSION=$(bump_version $TYPE)
  update_version $NEW_VERSION
  echo "New version: $NEW_VERSION"
elif [ "$1" == "get" ]; then
  get_version
else
  echo "Usage: $0 {bump [major|minor|patch]|get}"
  exit 1
fi

