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
        <p class="text-slate-400 mt-2">Track your fitness progress</p>
      </div>

      <!-- Form Container -->
      <div
        class="bg-slate-800 rounded-2xl border border-slate-700 p-8 shadow-2xl"
      >
        <!-- Tabs (hidden in reset mode) -->
        <div v-if="!isResetMode" class="flex gap-2 mb-8">
          <button
            @click="isLoginMode = true"
            :class="[
              'flex-1 py-3 px-4 rounded-lg font-semibold transition-all',
              isLoginMode
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600',
            ]"
          >
            Login
          </button>
          <button
            @click="isLoginMode = false"
            :class="[
              'flex-1 py-3 px-4 rounded-lg font-semibold transition-all',
              !isLoginMode
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600',
            ]"
          >
            Sign Up
          </button>
        </div>

        <!-- Reset Password Header -->
        <div v-if="isResetMode" class="mb-8">
          <h2 class="text-2xl font-bold text-white mb-2">Reset Password</h2>
          <p class="text-slate-400 text-sm">
            Enter your email to receive a password reset link
          </p>
        </div>

        <!-- Error/Success Message -->
        <div
          v-if="error || resetSent"
          :class="[
            'mb-4 p-4 rounded-lg text-sm',
            resetSent
              ? 'bg-emerald-900/30 border border-emerald-500 text-emerald-200'
              : isEmailNotConfirmed
                ? 'bg-amber-900/30 border border-amber-500 text-amber-200'
                : 'bg-red-900/30 border border-red-500 text-red-200',
          ]"
        >
          <div v-if="resetSent" class="space-y-3">
            <div class="flex items-start gap-3">
              <span class="text-lg mt-0.5">✅</span>
              <div>
                <p class="font-semibold mb-1">Check your email</p>
                <p class="text-xs leading-relaxed">
                  We sent a password reset link to
                  <span class="font-mono bg-black/30 px-2 py-1 rounded">
                    {{ email }}
                  </span>
                </p>
              </div>
            </div>
            <p class="text-xs leading-relaxed ml-8">
              Click the link in your email to create a new password. If you
              don't see it, check your spam folder.
            </p>
            <button
              type="button"
              @click="
                resetSent = false;
                isResetMode = false;
                isLoginMode = true;
              "
              class="mt-3 ml-8 text-xs font-semibold text-emerald-300 hover:text-emerald-200 underline"
            >
              Back to login
            </button>
          </div>
          <div v-else-if="isEmailNotConfirmed" class="space-y-3">
            <div class="flex items-start gap-3">
              <span class="text-lg mt-0.5">📧</span>
              <div>
                <p class="font-semibold mb-1">Email not confirmed</p>
                <p class="text-xs leading-relaxed">
                  We sent a confirmation email to
                  <span class="font-mono bg-black/30 px-2 py-1 rounded">
                    {{ email }}
                  </span>
                </p>
              </div>
            </div>
            <p class="text-xs leading-relaxed ml-8">
              Please check your inbox (and spam folder) and click the
              confirmation link to access your account.
            </p>
            <button
              type="button"
              @click="resendConfirmationEmail"
              :disabled="resendingEmail"
              class="mt-3 ml-8 text-xs font-semibold text-amber-300 hover:text-amber-200 disabled:opacity-50 underline"
            >
              {{ resendingEmail ? "Sending..." : "Resend confirmation email" }}
            </button>
          </div>
          <div v-else>
            {{ error }}
          </div>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-slate-200 mb-2"
              >Email</label
            >
            <input
              v-model="email"
              type="email"
              required
              placeholder="you@example.com"
              class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition"
            />
          </div>

          <!-- Password (hidden in reset mode) -->
          <div v-if="!isResetMode">
            <label class="block text-sm font-medium text-slate-200 mb-2"
              >Password</label
            >
            <input
              v-model="password"
              type="password"
              required
              placeholder="••••••••"
              class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition"
            />
          </div>

          <!-- Password Confirm (Sign Up only) -->
          <div v-if="!isLoginMode && !isResetMode">
            <label class="block text-sm font-medium text-slate-200 mb-2"
              >Confirm Password</label
            >
            <input
              v-model="passwordConfirm"
              type="password"
              required
              placeholder="••••••••"
              class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition"
            />
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all mt-6"
          >
            <span v-if="!loading">
              {{
                isResetMode
                  ? "Send Reset Link"
                  : isLoginMode
                    ? "Login"
                    : "Create Account"
              }}
            </span>
            <span v-else class="flex items-center justify-center gap-2">
              <div
                class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
              ></div>
              Processing...
            </span>
          </button>
        </form>

        <!-- Helper Text -->
        <div v-if="!isResetMode" class="space-y-3 mt-6">
          <p class="text-center text-slate-400 text-sm">
            {{
              isLoginMode
                ? "Don't have an account? "
                : "Already have an account? "
            }}
            <button
              @click="isLoginMode = !isLoginMode"
              type="button"
              class="text-emerald-400 hover:text-emerald-300 font-semibold"
            >
              {{ isLoginMode ? "Sign up" : "Login" }}
            </button>
          </p>
          <div v-if="isLoginMode" class="text-center">
            <button
              @click="
                isResetMode = true;
                error = '';
              "
              type="button"
              class="text-sm text-slate-400 hover:text-slate-300"
            >
              Forgot your password?
            </button>
          </div>
        </div>

        <!-- Back Button (in reset mode) -->
        <div v-else class="text-center mt-6">
          <button
            @click="
              isResetMode = false;
              isLoginMode = true;
              error = '';
            "
            type="button"
            class="text-sm text-slate-400 hover:text-slate-300"
          >
            Back to login
          </button>
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

const authStore = useAuthStore();
const router = useRouter();
const { supabase } = useSupabase();

const isLoginMode = ref(true);
const isResetMode = ref(false);
const email = ref("");
const password = ref("");
const passwordConfirm = ref("");
const error = ref("");
const resetSent = ref(false);
const loading = ref(false);
const resendingEmail = ref(false);

const isEmailNotConfirmed = computed(() => {
  return error.value.toLowerCase().includes("email not confirmed");
});

const handleSubmit = async () => {
  error.value = "";

  // Validate
  if (!email.value) {
    error.value = "Please fill in all fields";
    return;
  }

  // In reset mode, solo email è necessaria
  if (!isResetMode.value) {
    if (!password.value) {
      error.value = "Please fill in all fields";
      return;
    }

    if (!isLoginMode.value && password.value !== passwordConfirm.value) {
      error.value = "Passwords do not match";
      return;
    }
  }

  loading.value = true;

  try {
    if (isResetMode.value) {
      // Handle password reset
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email.value,
        {
          redirectTo: `${window.location.origin}/login`,
        },
      );

      if (resetError) throw resetError;

      resetSent.value = true;
    } else if (isLoginMode.value) {
      const { error: signInError } = await authStore.signIn(
        email.value,
        password.value,
      );
      if (signInError) {
        error.value = signInError.message;
        return;
      }
    } else {
      const { error: signUpError } = await authStore.signUp(
        email.value,
        password.value,
      );
      if (signUpError) {
        error.value = signUpError.message;
        return;
      }
    }

    // Navigate to home (not for reset mode)
    if (!isResetMode.value) {
      await router.push("/");
    }
  } catch (err: any) {
    error.value = err.message || "An error occurred";
  } finally {
    loading.value = false;
  }
};

const resendConfirmationEmail = async () => {
  if (!email.value) {
    error.value = "Please enter your email address";
    return;
  }

  resendingEmail.value = true;
  error.value = "";

  try {
    const { error: resendError } = await supabase.auth.resend({
      type: "signup",
      email: email.value,
    });

    if (resendError) throw resendError;

    error.value = "✅ Confirmation email sent! Check your inbox.";
  } catch (err: any) {
    error.value = "Failed to resend email: " + (err.message || "Unknown error");
  } finally {
    resendingEmail.value = false;
  }
};
</script>
