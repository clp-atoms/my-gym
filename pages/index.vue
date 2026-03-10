<template>
  <div class="space-y-12">
    <!-- Hero Section -->
    <div
      class="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-700 dark:via-purple-700 dark:to-pink-700 p-8 md:p-12 lg:p-16"
    >
      <div
        class="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)]"
      ></div>
      <div class="relative z-10">
        <h1 class="text-4xl md:text-5xl font-bold text-white mb-4">
          My Workout Plans
        </h1>
        <p class="text-lg text-blue-100 max-w-2xl mb-8">
          Manage your workout plans and track your progress toward your goals
        </p>

        <!-- Continua da ultima scheda -->
        <div v-if="lastWorkoutPlan" class="mb-8">
          <NuxtLink :to="`/workout-plans/${lastWorkoutPlan.id}`">
            <div
              class="inline-block bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg px-4 py-3 hover:bg-white/30 transition-all cursor-pointer"
            >
              <p class="text-sm text-blue-50 mb-1">Last Workout Plan Opened:</p>
              <p class="text-lg font-semibold text-white">
                {{ lastWorkoutPlan.name }}
              </p>
            </div>
          </NuxtLink>
        </div>

        <UButton
          icon="i-heroicons-plus-20-solid"
          size="lg"
          class="bg-white text-blue-600 hover:bg-blue-50"
          @click="isModalOpen = true"
        >
          New Workout Plan
        </UButton>
      </div>
      <!-- Decorative elements -->
      <div
        class="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -z-0"
      ></div>
      <div
        class="absolute bottom-0 left-1/2 w-40 h-40 bg-white/10 rounded-full blur-3xl -z-0"
      ></div>
    </div>

    <!-- Loading State -->
    <div
      v-if="loading"
      class="flex flex-col justify-center items-center h-64 space-y-4"
    >
      <div class="relative w-12 h-12">
        <div
          class="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 border-r-purple-500 animate-spin"
        ></div>
      </div>
      <p class="text-slate-600 dark:text-slate-400 font-medium">
        Loading workout plans...
      </p>
    </div>

    <!-- Empty State -->
    <div v-else-if="workoutPlans.length === 0" class="text-center py-20">
      <div
        class="mb-6 inline-block p-6 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30"
      >
        <div class="text-6xl">📋</div>
      </div>
      <h3 class="text-2xl font-bold text-slate-900 dark:text-white mb-3">
        No workout plans yet
      </h3>
      <p class="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
        Start your training journey by creating your first workout plan
      </p>
      <UButton
        size="lg"
        class="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
        icon="i-heroicons-plus-20-solid"
        @click="isModalOpen = true"
      >
        Create your first workout plan
      </UButton>
    </div>

    <!-- Schede Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="(workoutPlan, idx) in workoutPlans"
        :key="workoutPlan.id"
        class="group relative"
        :style="{ '--animation-delay': `${idx * 100}ms` }"
      >
        <!-- Card with gradient border effect -->
        <div
          class="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-0 group-hover:opacity-75 transition duration-500 -z-10"
        ></div>

        <div
          class="relative bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 dark:border-slate-700 overflow-hidden h-full"
        >
          <!-- Top gradient bar -->
          <div
            class="h-1 w-full bg-gradient-to-r from-blue-500 to-purple-500"
          ></div>

          <div class="p-6 flex flex-col h-full">
            <div class="flex-1">
              <h3
                class="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition"
              >
                {{ workoutPlan.name }}
              </h3>
              <p
                v-if="workoutPlan.description"
                class="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-2"
              >
                {{ workoutPlan.description }}
              </p>
              <div class="space-y-2 mb-4">
                <p
                  class="text-xs text-slate-500 dark:text-slate-500 font-medium"
                >
                  📅
                  {{
                    new Date(workoutPlan.created_at).toLocaleDateString(
                      "en-US",
                      { year: "numeric", month: "long", day: "numeric" },
                    )
                  }}
                </p>
                <p
                  class="inline-block px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-semibold"
                >
                  💪 {{ exerciseCount(workoutPlan.id) }} exercises
                </p>
              </div>
            </div>

            <div
              class="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700"
            >
              <NuxtLink :to="`/workout-plans/${workoutPlan.id}`" class="flex-1">
                <UButton
                  block
                  color="blue"
                  variant="soft"
                  icon="i-heroicons-eye-20-solid"
                  class="hover:scale-105 transition-transform"
                >
                  View Details
                </UButton>
              </NuxtLink>
              <UButton
                color="red"
                variant="ghost"
                icon="i-heroicons-trash-20-solid"
                class="hover:bg-red-100 dark:hover:bg-red-900/30 transition"
                @click="confirmDelete(workoutPlan.id)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal New Workout Plan -->
    <UModal v-model:open="isModalOpen">
      <!-- <UCard
        :ui="{
          base: 'h-full flex flex-col',
          divide: 'divide-y divide-gray-100 dark:divide-gray-800',
        }"
        class="h-full"
      > -->
      <template #header>
        <div class="flex items-center gap-3">
          <div class="text-2xl">📝</div>
          <h2
            class="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text"
          >
            New Workout Plan
          </h2>
        </div>
      </template>

      <template #body>
        <div class="space-y-6 flex-1 overflow-y-auto">
          <div>
            <label
              class="block text-sm font-semibold text-slate-900 dark:text-white mb-3"
            >
              Workout Plan Name
            </label>
            <input
              v-model="newWorkoutPlan.name"
              type="text"
              placeholder="e.g. Upper Body"
              class="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
            />
          </div>

          <div>
            <label
              class="block text-sm font-semibold text-slate-900 dark:text-white mb-3"
            >
              Description (optional)
            </label>
            <textarea
              v-model="newWorkoutPlan.description"
              placeholder="e.g. Upper body exercises..."
              rows="4"
              class="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition resize-none"
            />
          </div>
        </div>
      </template>

      <template #footer>
        <div class="flex gap-3 justify-end">
          <UButton color="gray" variant="ghost" @click="isModalOpen = false">
            Cancel
          </UButton>
          <UButton
            class="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            @click="createWorkoutPlan"
            :disabled="!newWorkoutPlan.name"
            :loading="creatingWorkoutPlan"
          >
            Create Workout Plan
          </UButton>
        </div>
      </template>
      <!-- </UCard> 
      -->
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { useWorkoutStore } from "~/stores/workoutStore";

const workoutStore = useWorkoutStore();
const { supabase } = useSupabase();

const loading = ref(false);
const isModalOpen = ref(false);
const creatingWorkoutPlan = ref(false);

const newWorkoutPlan = ref({
  name: "",
  description: "",
});

const workoutPlans = computed(() => workoutStore.workoutPlans);
const lastWorkoutPlan = computed(() => workoutStore.lastWorkoutPlan);

onMounted(async () => {
  loading.value = true;
  try {
    const { data, error } = await supabase
      .from("workout_plans")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Map Italian field names to English
    const mappedPlans = (data || []).map((plan: any) => ({
      id: plan.id,
      name: plan.name || plan.nome,
      description: plan.description || plan.descrizione,
      created_at: plan.created_at,
      exercises: plan.exercises,
    }));

    workoutStore.setWorkoutPlans(mappedPlans);

    // Load the last workout plan executed from localStorage (after plans are loaded)
    workoutStore.loadLastWorkoutPlanId();

    // Load all exercises
    const { data: exercises, error: exercisesError } = await supabase
      .from("exercises")
      .select("*");

    if (exercisesError) throw exercisesError;

    // Map Italian field names to English
    const mappedExercises = (exercises || []).map((ex: any) => ({
      id: ex.id,
      workout_plan_id: ex.workout_plan_id,
      name: ex.name || ex.nome,
      equipment: ex.equipment || ex.attrezzo,
      description: ex.description || ex.descrizione,
      sets: Number(ex.sets || ex.serie || 0),
      reps: Number(ex.reps || ex.ripetizioni || 0),
      current_weight: Number(ex.current_weight || ex.peso_attuale || 0),
      rest_time: Number(ex.rest_time || ex.recupero || 0),
      duration: Number(ex.duration || ex.tempo || 0),
    }));

    workoutStore.setExercises(mappedExercises);
  } catch (error) {
    console.error("Error loading workout plans:", error);
  } finally {
    loading.value = false;
  }
});

const exerciseCount = (workoutPlanId: string) => {
  return workoutStore.exercisesByWorkoutPlan(workoutPlanId).length;
};

const createWorkoutPlan = async () => {
  if (!newWorkoutPlan.value.name) return;

  creatingWorkoutPlan.value = true;
  try {
    const { data, error } = await supabase
      .from("workout_plans")
      .insert([
        {
          name: newWorkoutPlan.value.name,
          description: newWorkoutPlan.value.description,
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) throw error;
    if (data?.[0]) {
      workoutStore.addWorkoutPlan(data[0]);
      newWorkoutPlan.value = { name: "", description: "" };
      isModalOpen.value = false;
    }
  } catch (error) {
    console.error("Error creating workout plan:", error);
  } finally {
    creatingWorkoutPlan.value = false;
  }
};

const confirmDelete = async (workoutPlanId: string) => {
  const confirmed = confirm(
    "Are you sure you want to delete this workout plan?",
  );
  if (!confirmed) return;

  try {
    const { error: deleteExercisesError } = await supabase
      .from("exercises")
      .delete()
      .eq("workout_plan_id", workoutPlanId);

    if (deleteExercisesError) throw deleteExercisesError;

    const { error } = await supabase
      .from("workout_plans")
      .delete()
      .eq("id", workoutPlanId);

    if (error) throw error;

    workoutStore.deleteWorkoutPlan(workoutPlanId);
  } catch (error) {
    console.error("Error deleting workout plan:", error);
  }
};
</script>
