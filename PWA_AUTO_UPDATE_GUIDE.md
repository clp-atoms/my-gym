# PWA Auto-Update Guide for iOS

## 🎯 The Solution

You've implemented an **intelligent versioning system** to automatically update your PWA on iOS whenever you release an update.

## 📱 How It Works

### 1. **Version Field in Manifest**

- The `manifest.json` file now contains a `version` field (currently `"1.0.0"`)
- This number changes with each release

### 2. **Service Worker Monitoring**

- The service worker monitors the manifest version
- When the version changes, it invalidates the cache

### 3. **Enhanced PWA Plugin**

- The plugin checks the manifest every 10 minutes (5 seconds in dev)
- When it detects a version change, it clears ALL cache
- The page reloads automatically

### 4. **Netlify Cache-Control Headers**

- The manifest, main HTML, and service worker have a TTL of 300 seconds (5 minutes)
- CSS and JS have long-term cache (1 year) but with immutable hash
- This ensures iOS always fetches the latest manifest

## 🚀 How to Release an Update

### Step 1: Increment the Version Number

Before deploying to Netlify, use one of these Bun commands to automatically update `manifest.json`:

```bash
# For a bug fix (1.0.0 → 1.0.1)
bun run pwa:version:patch

# For a new feature (1.0.0 → 1.1.0)
bun run pwa:version:minor

# For a breaking change (1.0.0 → 2.0.0)
bun run pwa:version:major
```

**Semantic Versioning (MAJOR.MINOR.PATCH):**

- **MAJOR** (first number): change when making breaking changes
- **MINOR** (second number): change when adding new features
- **PATCH** (third number): change for bug fixes

Examples:

```json
"version": "1.0.0"  // Initial release
"version": "1.0.1"  // Bug fix
"version": "1.1.0"  // New feature
"version": "2.0.0"  // Breaking change
```

### Step 2: Commit and Push to Git

```bash
git add public/manifest.json
git commit -m "Bump PWA version to 1.0.1"
git push
```

### Step 3: Deploy to Netlify

- Netlify will automatically deploy when it sees your push
- Wait for the build to complete

### Step 4: iOS Users See the Update

✅ When users open the app installed on their home screen:

- Within 5 minutes, their device will download the updated manifest
- They will detect the version change
- **The cache will be cleared automatically**
- **The page will reload with the latest CSS/JS**

## 🔄 Update Timeline

| Event                        | Timing                         |
| ---------------------------- | ------------------------------ |
| You release an update        | Instant                        |
| Netlify completes deployment | ~2-5 minutes                   |
| iOS checks manifest          | Every 10 minutes (or on focus) |
| Cache invalidated and reload | <1 second                      |
| **User sees new version**    | **Within 10 minutes**          |

## 🛠️ Development Mode (Dev)

In dev (`bun run dev`):

- The plugin checks the manifest every 5 seconds
- Perfect for testing updates locally

To test:

1. Start the app in dev: `bun run dev`
2. In another terminal, bump the version: `bun run pwa:version:patch`
3. Open the browser console (F12)
4. Within 5 seconds you should see the automatic reload

## 🔍 Debugging

Open the browser console (F12) and look for `[PWA]` logs:

```javascript
// Verify the manifest is cached correctly
[PWA] Plugin: Manifest version loaded: 1.0.0

// After a version change you should see:
[PWA] Plugin: Manifest version changed! Old: 1.0.0 New: 1.0.1

// Then the cache is cleared:
[PWA] Plugin: Update detected, clearing cache

// Finally the reload:
[PWA] Cache cleared, reloading page
```

## ✨ Benefits of This System

✅ **Automatic**: No manual intervention required on iOS  
✅ **Fast**: Updates within 10 minutes  
✅ **Reliable**: Works even without full service worker support on iOS  
✅ **Simple**: Just change a version number in the manifest  
✅ **Compatible**: Works on all PWA browsers

## 🚨 If Users Don't See the Update

If a user doesn't see the update:

1. **Open the PWA from home screen**
2. Wait for it to gain focus (the plugin checks immediately)
3. The version will automatically change in the manifest
4. The cache will be cleared and the page will reload

If it still doesn't work (rare):

- Last resort: Close the app and reopen it

## 📝 Deployment Checklist

Before every production release:

- [ ] Tested locally that CSS renders correctly
- [ ] Ran version bump: `bun run pwa:version:patch` (or minor/major)
- [ ] Committed the change the script made
- [ ] Pushed to GitHub
- [ ] Netlify completed the deployment
- [ ] Tested on device that the styles appear after reload

## 🎉 All Set!

Now every time you release an update:

- ✅ iOS users won't need to remove and reinstall the app
- ✅ The app will update automatically within 10 minutes
- ✅ CSS and styles will always be fresh
