# 🚀 Complete Supabase Setup - MY GYM

Step-by-step guide to configure **Supabase from scratch** with authentication and database for the My Gym application.

---

## 📋 Prerequisites

- Free Supabase account: https://supabase.com
- `.env.local` file in the project root (we'll create it)

---

## ✅ PHASE 1: Creating Supabase Project

### Step 1.1: Create a new project

1. **Go to** https://app.supabase.com
2. **Click** "New Project"
3. **Fill in the form:**
   - **Project name**: "my-gym"
   - **Database password**: Choose a secure password (save it!)
   - **Region**: Select the region closest to you (e.g., EU-West for Italy)
4. **Click "Create new project"** (wait 5-10 minutes)

### Step 1.2: Get your credentials

Once created:

1. **Go to Settings** → **API**
2. **Copy these values** (you'll use them later):
   - **Project URL**: e.g. `https://xxxxxxxxxxxx.supabase.co`
   - **anon public**: the anonymous key

---

## ✅ PHASE 2: Authentication Configuration

### Step 2.1: Disable email verification (Development)

If you want to **develop without email verification**:

1. **Go to Authentication** → **Providers** → **Email**
2. **Enable "Email provider"**
3. **In the "Email Confirmations" panel**:
   - Disable ✓ **"Require email confirmation"**
4. **Save**

> ⚠️ **Production**: Enable email verification, add custom SMTP for real emails

### Step 2.2: Configure Email Confirmations (Optional - Production)

If you prefer to have email confirmation:

1. **Authentication** → **Email Templates**
2. **Modify the** "Confirm signup" template if needed
3. **Keep enabled** "Require email confirmation"
4. **Users will receive a verification link via email**

---

## 📊 Database Schema Overview

Before creating the tables, here's what each one does:

| Table                | Purpose                                                                             |
| -------------------- | ----------------------------------------------------------------------------------- |
| **workout_plans**    | Store user's workout routines (e.g., "Upper Body", "Lower Body")                    |
| **exercises**        | Individual exercises within a workout plan (e.g., "Bench Press")                    |
| **weight_history**   | Track weight progression over time for each exercise                                |
| **user_preferences** | Store user preferences like `last_workout_plan_id` (synced across devices/browsers) |

---

## ✅ PHASE 3: Creating Database Tables

### Step 3.1: Access SQL Editor

1. **Click on "SQL Editor"** in the left menu
2. **Click "New Query"**
3. **Copy and paste the following SQL:**

```sql
-- ============================================
-- TABLE: workout_plans
-- ============================================
CREATE TABLE IF NOT EXISTS workout_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- TABLE: exercises
-- ============================================
CREATE TABLE IF NOT EXISTS exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  workout_plan_id UUID NOT NULL REFERENCES workout_plans(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  equipment TEXT,
  description TEXT,
  sets INTEGER DEFAULT 0,
  reps INTEGER DEFAULT 0,
  current_weight NUMERIC DEFAULT 0,
  rest_time INTEGER DEFAULT 0,
  duration INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- TABLE: weight_history
-- ============================================
CREATE TABLE IF NOT EXISTS weight_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  weight NUMERIC NOT NULL,
  date TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- TABLE: user_preferences
-- ============================================
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  last_workout_plan_id UUID,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id)
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS workout_plans_user_id_idx ON workout_plans(user_id);
CREATE INDEX IF NOT EXISTS exercises_user_id_idx ON exercises(user_id);
CREATE INDEX IF NOT EXISTS exercises_workout_plan_id_idx ON exercises(workout_plan_id);
CREATE INDEX IF NOT EXISTS weight_history_user_id_idx ON weight_history(user_id);
CREATE INDEX IF NOT EXISTS weight_history_exercise_id_idx ON weight_history(exercise_id);
CREATE INDEX IF NOT EXISTS user_preferences_user_id_idx ON user_preferences(user_id);
```

4. **Click "Run"** (wait for it to complete)
5. **You should see a success message**

### Step 3.2: Verify tables

1. **In the left menu, click "Table Editor"**
2. **Verify that you see:**
   - ✅ `workout_plans`
   - ✅ `exercises`
   - ✅ `weight_history`
   - ✅ `user_preferences`

---

## ✅ PHASE 4: Row Level Security (RLS) Configuration

### Step 4.1: Enable RLS

1. **Go to Authentication** → **Policies**
2. **For each table** (`workout_plans`, `exercises`, `weight_history`, `user_preferences`):
   - Select it
   - Click **"Enable RLS"**

### Step 4.2: Add Policies

Go back to **SQL Editor** and copy/paste this SQL:

```sql
-- ============================================
-- POLICIES: workout_plans
-- ============================================
CREATE POLICY "Users can see their own workout plans"
  ON workout_plans FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own workout plans"
  ON workout_plans FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own workout plans"
  ON workout_plans FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own workout plans"
  ON workout_plans FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- POLICIES: exercises
-- ============================================
CREATE POLICY "Users can see their own exercises"
  ON exercises FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own exercises"
  ON exercises FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own exercises"
  ON exercises FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own exercises"
  ON exercises FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- POLICIES: weight_history
-- ============================================
CREATE POLICY "Users can see their own weight history"
  ON weight_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own weight history"
  ON weight_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own weight history"
  ON weight_history FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own weight history"
  ON weight_history FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- POLICIES: user_preferences
-- ============================================
CREATE POLICY "Users can see their own preferences"
  ON user_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences"
  ON user_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences"
  ON user_preferences FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own preferences"
  ON user_preferences FOR DELETE
  USING (auth.uid() = user_id);
```

**Click "Run"** and wait for it to complete.

### Step 4.3: Verify Policies

1. **Go back to Authentication** → **Policies**
2. **Select each table and verify you see:**
   - 4 policies for `workout_plans`
   - 4 policies for `exercises`
   - 4 policies for `weight_history`
   - 4 policies for `user_preferences`

---

## ✅ PHASE 5: Environment Variables Configuration

### Step 5.1: Create the `.env.local` file

1. **In the project root** (`/Users/clp-atoms/Sites/my-projects/my-gym/`), **create a file** called `.env.local`

2. **Add these lines** (replace with your values):

```bash
NUXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NUXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
```

**Where to find them:**

- **URL**: Settings → API → Project URL
- **ANON_KEY**: Settings → API → Project API keys → anon (public)

### Step 5.2: Verify it works

```bash
cd /Users/clp-atoms/Sites/my-projects/my-gym
bun run dev
```

If there are no connection errors, ✅ you're configured!

---

## ✅ PHASE 6: Configuration Testing

### Test 1: Registration

1. **Visit** http://localhost:3000/login
2. **Click "Sign Up"**
3. **Register with:**
   - Email: `test@example.com`
   - Password: `Test123!`
   - Confirm: `Test123!`
4. **Click "Create Account"**

**Expected result:** ✅ Redirected to `/` (home)

### Test 2: Login

1. **Click "Logout"** (top right)
2. **You're sent back to `/login`**
3. **Click "Login"**
4. **Sign in with:**
   - Email: `test@example.com`
   - Password: `Test123!`

**Expected result:** ✅ You log in and see the home page

### Test 3: Data Protection

1. **Log in as `test@example.com`**
2. **Create a workout plan** (click "New Workout Plan")
3. **In Supabase, go to Table Editor** → **workout_plans**
4. **You should see a row with** `user_id = [the user's ID]`

**Expected result:** ✅ The workout plan is associated with the user

### Test 4: Data Isolation

1. **Register as a second user** (`test2@example.com`)
2. **Create a different workout plan**
3. **Log out and return to the first account** (`test@example.com`)
4. **In the workout_plans table, you should see only 1 of yours**

**Expected result:** ✅ Each user sees only their own data

---

## 📁 Configuration Files Created/Used

```
my-gym/
├── .env.local                    ← CREATE THIS
├── stores/
│   └── authStore.ts                   ✅ Authentication
├── composables/
│   └── useSupabase.ts                 ✅ Supabase Connection
│   └── useAuth.ts                     ✅ Auth helper
├── plugins/
│   └── auth.ts                        ✅ Route protection
├── pages/
│   ├── login.vue                      ✅ Login/Signup
│   ├── index.vue                      ✅ Workout Plans (protected)
│   ├── statistics.vue                 ✅ Statistics (protected)
│   └── workout-plans/
│       └── [id].vue                   ✅ Plan details (protected)
└── app.vue                            ✅ Main layout
```

---

## 🔒 Security & Best Practices

### ✅ Implemented

- [x] **Row Level Security (RLS)** - Each user sees only their own data
- [x] **Password hashing** - Supabase handles it automatically
- [x] **JWT tokens** - Token-based authentication
- [x] **Route protection** - Plugin that protects routes
- [x] **Foreign keys** - Referential integrity

### ⚠️ For Production

- [ ] Configure **Custom Email SMTP** (real credentials)
- [ ] Enable **Require email confirmation**
- [ ] Add **Rate limiting** for login/signup
- [ ] Configure **HTTPS**
- [ ] Add **Terms of Service** and **Privacy Policy**
- [ ] Implement **2FA** (two-factor authentication)
- [ ] Regular data backups

---

## 🐛 Troubleshooting

### Error: "Email not confirmed"

**Solution:**

1. In Supabase → Authentication → Email
2. Disable "Require email confirmation"
3. Retry the login

### Error: "Invalid API key"

**Solution:**

1. Verify that `.env.local` contains the correct values
2. Restart the dev server: `bun run dev`

### Error: "User or password incorrect"

**Solution:**

1. Make sure you used the **same email and password** as registration
2. In Supabase, go to Authentication → Users and verify the user exists

### Error: "Row level policy violation"

**Solution:**

1. Verify that the RLS policies were created
2. Verify that `user_id` is set in the records
3. Restart the dev server

---

## 📞 Support

- **Supabase Documentation**: https://supabase.com/docs
- **Nuxt Documentation**: https://nuxt.com
- **Issues**: Check the browser console (F12 → Console)

---

## ✨ Next Steps

After completing the configuration:

1. ✅ Deploy to **Netlify** with environment variables
2. ✅ Add **OAuth** (Google, GitHub)
3. ✅ Implement **Password Reset**
4. ✅ Add **User Avatar**
5. ✅ Automatic data backups

---

**Configuration complete?** 🎉 Your app is ready to use!
