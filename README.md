# 💪 MyGym - Gym Workout Tracker

A modern web app to manage gym workout plans with **Nuxt 4**, **Vue 3**, and **Supabase**. Track your strength progression over time with detailed statistics and visual charts.

## ✨ Features

- ✅ **Workout Plan Management** - Create and organize workout routines
- ✅ **Exercise Tracking** - Add exercises with equipment, sets, reps, and weight
- ✅ **Weight Progression Monitoring** - Visual charts with color-coded progress (green ↑ increase, orange ↓ decrease)
- ✅ **Detailed Statistics** - Per-plan insights with KPI cards and weight history
- ✅ **User Authentication** - Secure login with Supabase Auth
- ✅ **Data Isolation** - Each user sees only their own data (RLS enabled)
- ✅ **Weight History Tracking** - Complete record of your strength evolution
- ✅ **Cross-Device Sync** - Last opened workout plan synced across devices/browsers via Supabase
- ✅ **Responsive Design** - Mobile, tablet, and desktop optimized
- ✅ **Dark Mode** - Built-in dark theme
- ✅ **Zero Maintenance Costs** - Supabase free tier + Netlify free tier

## 🛠️ Tech Stack

- **Framework**: Nuxt 4
- **UI**: Vue 3 + Nuxt UI + Tailwind CSS 4
- **State Management**: Pinia
- **Authentication**: Supabase Auth (Email)
- **Database**: Supabase (PostgreSQL)
- **Hosting**: Netlify
- **Package Manager**: Bun
- **License**: MIT

## 🚀 Quick Start

### 1. Install Bun (if not already installed)

```bash
curl -fsSL https://bun.sh/install | bash
```

### 2. Install dependencies

```bash
bun install
```

### 3. Configure Supabase

**See the complete detailed guide:** [SUPABASE_COMPLETE_SETUP.md](./SUPABASE_COMPLETE_SETUP.md)

#### Quick Setup

1. Create account at https://supabase.com
2. Create a new project
3. Go to Settings → API
4. Copy `Project URL` and `anon public key`
5. Create `.env.local`:
   ```bash
   NUXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NUXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

#### Create Database Tables

Run the SQL from [SUPABASE_COMPLETE_SETUP.md](./SUPABASE_COMPLETE_SETUP.md) in Supabase SQL Editor. This creates:

- `workout_plans` - Your training routines
- `exercises` - Individual exercises in a plan
- `weight_history` - Track weight progression per exercise
- `user_preferences` - Store user preferences (last workout plan opened, synced across devices)

#### Enable Row Level Security (RLS)

Follow the RLS configuration in [SUPABASE_COMPLETE_SETUP.md](./SUPABASE_COMPLETE_SETUP.md) to ensure users see only their own data.

### 4. Start development

```bash
bun run dev
```

Open http://localhost:3000

### 5. Production build

```bash
bun run build
bun run preview
```

## 🌐 Deploy to Netlify

### 1. Prepare the repository

```bash
git add .
git commit -m "Initial commit"
git branch -M main
```

### 2. Push to GitHub

```bash
git remote add origin https://github.com/your-username/my-gym.git
git push -u origin main
```

### 3. Connect Netlify

1. Go to https://netlify.com
2. Click "Add new site" → "Import an existing project"
3. Select GitHub and the `my-gym` repository
4. Build settings:
   - Build command: `bun run build`
   - Publish directory: `.output/public`
5. Environment variables:
   ```
   NUXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NUXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
6. Click "Deploy site"

Netlify will automatically deploy when you push to main!

## 📁 Project Structure

```
my-gym/
├── app/
│   ├── pages/
│   │   ├── login.vue              # Login/Signup page
│   │   ├── index.vue              # Workout plans list
│   │   ├── statistics.vue         # Detailed statistics & charts
│   │   └── workout-plans/
│   │       └── [id].vue           # Plan details + exercises
│   └── app.vue                    # Main layout
├── components/                    # Reusable components
├── composables/
│   ├── useSupabase.ts             # Supabase configuration
│   └── useAuth.ts                 # Authentication helper
├── stores/
│   ├── authStore.ts               # Pinia auth store
│   └── workoutStore.ts            # Pinia store for plans/exercises
├── plugins/
│   └── auth.ts                    # Auth plugin with route guards
├── assets/
│   └── css/
│       └── main.css               # Tailwind CSS
├── server/
│   └── api/                       # API routes (optional)
├── public/
│   └── robots.txt                 # SEO
├── nuxt.config.ts                 # Nuxt configuration
├── tailwind.config.ts             # Tailwind configuration
├── tsconfig.json                  # TypeScript configuration
├── SUPABASE_COMPLETE_SETUP.md     # Detailed Supabase guide
├── LICENSE                        # MIT License
├── netlify.toml                   # Netlify configuration
└── bun.lockb                       # Bun lock file
```

## 📱 How to Use the App

### 🔑 Authentication

1. Visit http://localhost:3000/login
2. **Sign Up**: Create a new account with email and password
3. **Login**: Use your credentials to access the app
4. **Logout**: Click the logout button in the header

### 📋 Manage Workout Plans

1. Click **"New Workout Plan"** on the home page
2. Enter the plan name (e.g., "Upper Body", "Leg Day")
3. Add an optional description
4. Click **"Create Workout Plan"**
5. Your plan now appears in the list

### 🏋️ Add Exercises

1. Click on a workout plan to open it
2. Click **"Add Exercise"**
3. Fill in the details:
   - **Name**: Exercise name (e.g., Bench Press)
   - **Equipment**: Type of equipment (e.g., Dumbbells)
   - **Sets**: Number of sets (e.g., 3)
   - **Reps**: Repetitions per set (e.g., 10)
   - **Weight**: Starting weight in kg
4. Click **"Add"**

### ⚖️ Update Weight Progress

1. From the plan, click **"Update Weight"** on an exercise
2. Enter the new weight value
3. Click **"Save"**
4. The system automatically records the change

### 📊 View Statistics

1. Click **"Statistics"** in the menu
2. Select a workout plan
3. See detailed metrics:
   - Total exercises in the plan
   - Total weight across all exercises
   - Average weight trend
   - Individual exercise weight progression charts
   - Color-coded progress (green ↑ increase, orange ↓ decrease)
   - Latest updates timeline

## 🔒 Security & Privacy

- **User Isolation**: Each user only sees their own data (RLS enabled)
- **Authentication**: Secure login with Supabase Auth
- **No Data Sharing**: Your workouts are private
- **Data Encryption**: All data is encrypted in transit and at rest
- **Open Source**: MIT licensed, you can inspect the code

## 🐛 Troubleshooting

### Error: "NUXT_PUBLIC_SUPABASE_URL not found"

→ Verify that `.env.local` exists in the project root with correct values

### Error: "Email not confirmed"

→ In Supabase, disable "Require email confirmation" under Authentication → Email (for development)

### Error: "Invalid API key"

→ Check that your Supabase URL and anon key are correct in `.env.local`

### Build fails on Netlify

→ Check build logs. Verify:

- Environment variables are set in Netlify settings
- No typos in credentials
- Bun is available (Node 18+)

### Data not appearing

→ Check:

1. Browser console (F12) for errors
2. Supabase dashboard for data in tables
3. Row Level Security policies are correctly configured

**Full troubleshooting guide:** See [SUPABASE_COMPLETE_SETUP.md](./SUPABASE_COMPLETE_SETUP.md)

## 🚀 Future Improvements

- [ ] OAuth integration (Google, GitHub)
- [ ] Password reset functionality
- [ ] User profile with avatar
- [ ] Share workout plans with other users
- [ ] Workout reminders/notifications
- [ ] Rest timer during workouts
- [ ] Photo uploads for exercises
- [ ] Mobile app (React Native)
- [ ] Workout templates library
- [ ] CSV/JSON export/import
- [ ] Social features (leaderboards)
- [ ] AI exercise recommendations

## 📖 Documentation

- [Complete Supabase Setup Guide](./SUPABASE_COMPLETE_SETUP.md) - Step-by-step database & auth configuration
- [Nuxt Documentation](https://nuxt.com/docs) - Framework docs
- [Supabase Documentation](https://supabase.com/docs) - Database & auth docs
- [Tailwind CSS](https://tailwindcss.com/docs) - Styling framework

## 📄 License

MIT License - See [LICENSE](./LICENSE) file for details

This means you can freely use, modify, and distribute this project for personal or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Feel free to:

- Report issues
- Submit pull requests
- Suggest improvements
- Share your feedback

## 💬 Support

Having issues? Check:

1. Browser console (F12 → Console tab)
2. Supabase dashboard logs
3. [SUPABASE_COMPLETE_SETUP.md](./SUPABASE_COMPLETE_SETUP.md) troubleshooting section
4. GitHub issues

---

Made with 💪 and ☕ for fitness enthusiasts
