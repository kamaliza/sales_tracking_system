# PowerShell script for creating releases on Windows
# Usage: .\scripts\create-release.ps1 -VersionType patch|minor|major

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("patch", "minor", "major")]
    [string]$VersionType = "patch"
)

$ErrorActionPreference = "Stop"

Write-Host "Creating release..." -ForegroundColor Yellow

# Get current version from backend package.json
$backendPackageJson = Get-Content "backend\package.json" | ConvertFrom-Json
$currentVersion = $backendPackageJson.version
Write-Host "Current version: $currentVersion" -ForegroundColor Green

# Calculate new version
$versionParts = $currentVersion -split '\.'
$major = [int]$versionParts[0]
$minor = [int]$versionParts[1]
$patch = [int]$versionParts[2]

switch ($VersionType) {
    "major" {
        $major++
        $minor = 0
        $patch = 0
    }
    "minor" {
        $minor++
        $patch = 0
    }
    "patch" {
        $patch++
    }
}

$newVersion = "$major.$minor.$patch"
$tagName = "v$newVersion"

Write-Host "New version: $newVersion" -ForegroundColor Green
Write-Host "Tag name: $tagName" -ForegroundColor Green

# Update version in package.json files
Write-Host "Updating version in package.json files..." -ForegroundColor Yellow

# Update backend package.json
$backendPackageJson.version = $newVersion
$backendPackageJson | ConvertTo-Json -Depth 10 | Set-Content "backend\package.json" -Encoding UTF8

# Update frontend package.json
$frontendPackageJson = Get-Content "frontend\package.json" | ConvertFrom-Json
$frontendPackageJson.version = $newVersion
$frontendPackageJson | ConvertTo-Json -Depth 10 | Set-Content "frontend\package.json" -Encoding UTF8

# Update CHANGELOG.md
Write-Host "Updating CHANGELOG.md..." -ForegroundColor Yellow
$today = Get-Date -Format "yyyy-MM-dd"
$changelogContent = Get-Content "CHANGELOG.md" -Raw
$changelogContent = $changelogContent -replace "## \[Unreleased\]", "## [Unreleased]`n`n## [$newVersion] - $today"
Set-Content "CHANGELOG.md" -Value $changelogContent -Encoding UTF8

# Stage changes
Write-Host "Staging changes..." -ForegroundColor Yellow
git add backend\package.json frontend\package.json CHANGELOG.md

# Commit changes
Write-Host "Committing version changes..." -ForegroundColor Yellow
git commit -m "chore: bump version to $newVersion" 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "No changes to commit or commit failed" -ForegroundColor Yellow
}

# Create tag
Write-Host "Creating git tag..." -ForegroundColor Yellow
git tag -a "$tagName" -m "Release version $newVersion"

Write-Host "`nRelease created successfully!" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "  1. Review changes: git log" -ForegroundColor Cyan
Write-Host "  2. Push commits: git push origin main" -ForegroundColor Cyan
Write-Host "  3. Push tags: git push origin $tagName" -ForegroundColor Cyan
Write-Host "  4. GitHub Actions will automatically:" -ForegroundColor Cyan
Write-Host "     - Build Docker images" -ForegroundColor Cyan
Write-Host "     - Push to Docker Hub" -ForegroundColor Cyan
Write-Host "     - Create GitHub Release" -ForegroundColor Cyan

