<template>
  <div
    class="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4"
  >
    <div class="w-full max-w-md">
      <!-- Logo/Header -->
      <div class="text-center mb-8">
        <div
          class="inline-block p-4 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl mb-4"
        >
          <div class="text-4xl">💪</div>
        </div>
        <h1 class="text-3xl font-bold text-white">My Gym</h1>
        <p class="text-slate-400 mt-2">Reset your password</p>
      </div>

      <!-- Form Container -->
      <div
        class="bg-slate-800 rounded-2xl border border-slate-700 p-8 shadow-2xl"
      >
        <!-- Success Message -->
        <div
          v-if="resetSuccess"
          class="bg-emerald-900/30 border border-emerald-500 text-emerald-200 p-4 rounded-lg mb-6"
        >
          <div class="flex items-start gap-3">
            <span class="text-lg mt-0.5">✅</span>
            <div>
              <p class="font-semibold mb-1">Password updated successfully!</p>
              <p class="text-sm">You can now login with your new password.</p>
            </div>
          </div>
        </div>

        <!-- Error Message -->
        <div
          v-if="error && !resetSuccess"
          class="bg-red-900/30 border border-red-500 text-red-200 p-4 rounded-lg mb-6"
        >
          <p class="font-semibold mb-1">Error</p>
          <p class="text-sm">{{ error }}</p>
        </div>

        <!-- Form -->
        <div v-if="!resetSuccess" class="space-y-4">
          <h2 class="text-xl font-bold text-white mb-6">
            Create a new password
          </h2>

          <!-- New Password -->
          <div>
            <label class="block text-sm font-medium text-slate-200 mb-2"
              >New Password</label
            >
            <input
              v-model="newPassword"
              type="password"
              required
              placeholder="••••••••"
              class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition"
            />
            <p class="text-xs text-slate-400 mt-2">
              Minimum 6 characters required
            </p>
          </div>

          <!-- Confirm Password -->
          <div>
            <label class="block text-sm font-medium text-slate-200 mb-2"
              >Confirm Password</label
            >
            <input
              v-model="confirmPassword"
              type="password"
              required
              placeholder="••••••••"
              class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition"
            />
          </div>

          <!-- Submit Button -->
          <button
            @click="handleResetPassword"
            :disabled="loading"
            class="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all mt-8"
          >
            <span v-if="!loading">Update Password</span>
            <span v-else class="flex items-center justify-center gap-2">
              <div
                class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
              ></div>
              Updating...
            </span>
          </button>
        </div>

        <!-- Redirect Button (on success) -->
        <div v-else class="text-center">
          <NuxtLink
            to="/login"
            class="inline-block mt-6 py-3 px-8 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-lg transition-all"
          >
            Back to Login
          </NuxtLink>
        </div>
      </div>

      <!-- Footer -->
      <p class="text-center text-slate-500 text-xs mt-8">
        Your fitness data is secure and private
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
});

const { supabase } = useSupabase();
const router = useRouter();

const newPassword = ref("");
const confirmPassword = ref("");
const error = ref("");
const loading = ref(false);
const resetSuccess = ref(false);

// Verifica if user has a recovery session
const checkRecoverySession = async () => {
  try {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
      error.value =
        "Invalid or expired reset link. Please request a new password reset.";
      // Reindirizza a login dopo 3 secondi
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    }
  } catch (err: any) {
    console.error("Session check error:", err);
  }
};

const handleResetPassword = async () => {
  error.value = "";

  // Validazioni
  if (!newPassword.value || !confirmPassword.value) {
    error.value = "Please fill in all fields";
    return;
  }

  if (newPassword.value.length < 6) {
    error.value = "Password must be at least 6 characters long";
    return;
  }

  if (newPassword.value !== confirmPassword.value) {
    error.value = "Passwords do not match";
    return;
  }

  loading.value = true;

  try {
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword.value,
    });

    if (updateError) throw updateError;

    resetSuccess.value = true;

    // Reindirizza a login dopo 3 secondi
    setTimeout(() => {
      router.push("/login");
    }, 3000);
  } catch (err: any) {
    error.value = err.message || "Failed to update password";
    console.error("Password update error:", err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  checkRecoverySession();
});
</script>
