#!/bin/bash
# Generate PWA icons for MyGym
# Creates 192x192 and 512x512 PNG icons

set -e

ICON_DIR="public/icons"
THEME_COLOR="#059669"  # Emerald green from theme

# Create icons directory
mkdir -p "$ICON_DIR"

echo "🎨 Creating PWA icons for MyGym..."

# Check if ImageMagick is available
if ! command -v convert &> /dev/null; then
    echo "❌ ImageMagick not found. Install it with:"
    echo "   brew install imagemagick"
    echo ""
    echo "Or use online tools: https://www.pwabuilder.com/imageGenerator"
    exit 1
fi

# Create 512x512 icon
echo "  Creating 512x512 icon..."
convert \
  -size 512x512 \
  "xc:${THEME_COLOR}" \
  -gravity center \
  -pointsize 280 \
  -fill white \
  -font Arial \
  -antialias \
  -annotate +0+0 '💪' \
  "${ICON_DIR}/icon-512x512.png"

# Create 192x192 icon by resizing
echo "  Creating 192x192 icon..."
convert \
  "${ICON_DIR}/icon-512x512.png" \
  -resize 192x192 \
  "${ICON_DIR}/icon-192x192.png"

echo "✅ Icons created successfully!"
echo ""
echo "Files created:"
ls -lh "${ICON_DIR}"/icon-*.png
echo ""
echo "🚀 Ready to deploy!"
echo "   Icons are now in: ${ICON_DIR}/"
echo "   Your app is ready for installation on iOS, Android, and desktop!"
