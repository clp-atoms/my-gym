#!/bin/bash


# PWA Version Bumper with Semantic Versioning
# Usage: 
#   ./bump-pwa-version.sh major|minor|patch
#   ./bump-pwa-version.sh 1.0.1
#
# Examples:
#   ./bump-pwa-version.sh patch    # 1.0.0 -> 1.0.1
#   ./bump-pwa-version.sh minor    # 1.0.0 -> 1.1.0
#   ./bump-pwa-version.sh major    # 1.0.0 -> 2.0.0
#   ./bump-pwa-version.sh 1.2.3    # Set exact version

set -e

MANIFEST_FILE="public/manifest.json"

# Extract current version from manifest
CURRENT_VERSION=$(grep -o '"version": "[^"]*"' "$MANIFEST_FILE" | sed 's/"version": "//;s/"$//')

# Parse semantic version
IFS='.' read -r MAJOR MINOR PATCH <<< "$CURRENT_VERSION"

# If no argument provided, show help
if [ -z "$1" ]; then
    echo "📱 PWA Version Manager (Semantic Versioning)"
    echo "Current version: $CURRENT_VERSION"
    echo ""
    echo "Usage:"
    echo "  ./bump-pwa-version.sh patch    # Increment patch (1.0.0 → 1.0.1)"
    echo "  ./bump-pwa-version.sh minor    # Increment minor (1.0.0 → 1.1.0)"
    echo "  ./bump-pwa-version.sh major    # Increment major (1.0.0 → 2.0.0)"
    echo "  ./bump-pwa-version.sh 1.2.3    # Set exact version"
    exit 0
fi

# Determine new version
case "$1" in
    patch)
        PATCH=$((PATCH + 1))
        NEW_VERSION="$MAJOR.$MINOR.$PATCH"
        ;;
    minor)
        MINOR=$((MINOR + 1))
        PATCH=0
        NEW_VERSION="$MAJOR.$MINOR.$PATCH"
        ;;
    major)
        MAJOR=$((MAJOR + 1))
        MINOR=0
        PATCH=0
        NEW_VERSION="$MAJOR.$MINOR.$PATCH"
        ;;
    *)
        # Assume it's a version number like 1.2.3
        NEW_VERSION="$1"
        ;;
esac

# Update manifest.json
sed -i '' "s/\"version\": \"[0-9.]*\"/\"version\": \"$NEW_VERSION\"/" "$MANIFEST_FILE"

echo "📱 PWA Version Manager"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Current:  $CURRENT_VERSION"
echo "New:      $NEW_VERSION"
echo ""
echo "✅ Updated manifest.json"

# Show the change
echo ""
echo "📋 Verification:"
grep "version" "$MANIFEST_FILE"

echo ""
echo "🚀 Next steps:"
echo "  1. git add public/manifest.json"
echo "  2. git commit -m \"Bump PWA version to $NEW_VERSION\""
echo "  3. git push"
echo "  4. Wait for Netlify deploy to complete"
echo ""
echo "⏱️  iOS devices will update automatically within 10 minutes!"
