# PWA Setup Guide for MyGym

This guide walks you through completing the Progressive Web App (PWA) setup for MyGym.

## ✅ Completed Steps

1. **Service Worker** - Created at `/public/service-worker.js`
   - Handles offline caching with cache-first strategy
   - Skips API requests (always uses network)
   - Auto-updates service worker every minute

2. **PWA Plugin** - Created at `/plugins/pwa.ts`
   - Registers service worker on page load
   - Handles registration errors gracefully
   - Checks for updates periodically

3. **Meta Tags** - Updated `app.vue`
   - Added Apple mobile web app meta tags (iOS)
   - Added Android manifest linking
   - Set theme color and viewport

4. **Manifest File** - Created at `/public/manifest.json`
   - App name, icons, display mode
   - Start URL and scope

## 📱 Next Steps: Generate App Icons

You need to create two icon files in the `public/icons/` directory:

### Option 1: Using Online Tools (Easiest)

1. Go to [PWA Image Generator](https://www.pwabuilder.com/imageGenerator)
2. Upload or create a 512x512 image (MyGym logo or emoji)
3. Select:
   - 192x192 pixels
   - 512x512 pixels
4. Download and extract the ZIP file
5. Copy `icon-192x192.png` and `icon-512x512.png` to `public/icons/`

### Option 2: Using ImageMagick (Command Line)

```bash
# If you don't have ImageMagick, install it:
brew install imagemagick

# Create directories
mkdir -p public/icons

# Create a simple icon using ImageMagick
convert -size 512x512 xc:#059669 -gravity center -pointsize 200 -fill white -annotate +0+0 '💪' public/icons/icon-512x512.png
convert public/icons/icon-512x512.png -resize 192x192 public/icons/icon-192x192.png
```

### Option 3: Using a Graphic Design Tool (Figma, Sketch, etc.)

1. Create a 512x512 square image
2. Use background color: `#059669` (emerald green)
3. Add icon: 💪 emoji or custom gym logo centered
4. Use padding for safe area (icon should be 80% of canvas)
5. Export as PNG twice:
   - 512x512 → `icon-512x512.png`
   - 192x192 → `icon-192x192.png`
6. Save both to `public/icons/` folder

## 🔧 Icon File Requirements

- **Format**: PNG with transparency
- **Locations**:
  - `public/icons/icon-192x192.png` (192×192 pixels)
  - `public/icons/icon-512x512.png` (512×512 pixels)
- **Recommended**:
  - Background: `#059669` (emerald green from theme)
  - Foreground: White or 💪 emoji
  - Padding: Leave 10-15% margin for iOS maskable icon support

## 📋 Directory Structure After Setup

```
public/
  ├── service-worker.js      ✅ Created
  ├── manifest.json          ✅ Created
  ├── robots.txt
  └── icons/
      ├── icon-192x192.png   ⚠️ CREATE THIS
      └── icon-512x512.png   ⚠️ CREATE THIS
```

## 🧪 Testing PWA Installation

### On macOS/Safari:

1. Run the app: `bun run dev`
2. Open in Safari: `http://localhost:3000` or your site URL
3. Menu → Share → Add to Home Screen
4. App will appear on home screen

### On Chrome (Desktop):

1. Open DevTools (F12)
2. Go to Application tab → Manifest
3. Click "Install" button that appears

### On Android:

1. Open in Chrome Mobile
2. Menu → "Install app"
3. App installs to home screen

### On iOS (iPhone/iPad):

1. Open in Safari Mobile
2. Share button (↗️)
3. Scroll and tap "Add to Home Screen"
4. Confirm app name and install

## 🔒 Production Requirements

Before deploying to production:

1. **HTTPS is required** - PWA features only work over HTTPS
2. **Netlify Configuration** - Already handles most PWA requirements
3. **Service Worker Scope** - Already configured in `service-worker.js`
4. **Icons** - Must be in place before deployment

### Verify with Lighthouse (Chrome DevTools)

1. Open DevTools → Lighthouse
2. Run "PWA" audit
3. Check for:
   - ✅ Installable (all icons present)
   - ✅ Service worker registered
   - ✅ HTTPS enabled
   - ✅ Manifest valid

## 📦 Cache Strategy

The service worker uses a **cache-first strategy**:

1. **First Load** - Caches essential files (HTML, CSS, JS, icons)
2. **Subsequent Visits** - Serves from cache for faster load
3. **Background Updates** - Fetches latest from network
4. **Offline Support** - Serves cached pages when offline
5. **API Requests** - Always skip cache (always uses network)

### Files Cached on Install:

- `/` (homepage)
- `/login`
- `/index.html`
- `/manifest.json`
- `/icons/icon-192x192.png`
- `/icons/icon-512x512.png`

## 🐛 Troubleshooting

**Icons aren't showing?**

- Check file paths match exactly: `/public/icons/icon-192x192.png`
- Verify PNG format (not JPG)
- Check file permissions
- Clear browser cache and reload

**"Install" button not appearing?**

- Ensure HTTPS is enabled (or localhost for testing)
- Check all meta tags are present in DevTools head
- Verify manifest.json is valid (DevTools → Application → Manifest)
- Check service worker registered (DevTools → Application → Service Workers)

**App not loading offline?**

- Service worker might not have cached files yet
- Visit app online first to trigger caching
- Check DevTools → Application → Cache Storage
- Look for "mygym-v1" cache with files

**Service Worker won't update?**

- Service worker updates are checked every minute
- Hard refresh (Cmd+Shift+R on Mac) to bypass cache
- Or manually unregister in DevTools → Application → Service Workers

## 📚 Resources

- [MDN: Progressive Web Apps](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [Web.dev: Installable](https://web.dev/installable/)
- [PWA Builder](https://www.pwabuilder.com/)
- [iOS PWA Support](https://medium.com/@firt/progressive-web-apps-on-ios-are-here-d00430dee3a7)

## ✨ Summary

Your app now has:

- ✅ Service worker for offline support
- ✅ PWA manifest for app metadata
- ✅ iOS support via meta tags
- ✅ Android support via manifest
- ⏳ **NEXT**: Generate and place icon files

Once you create the icon files, your app will be fully installable on iOS, Android, and desktop browsers!
