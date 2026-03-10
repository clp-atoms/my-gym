<template>
  <div class="space-y-12">
    <!-- Hero Section -->
    <div
      class="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-700 dark:via-teal-700 dark:to-cyan-700 p-8 md:p-12 lg:p-16"
    >
      <div
        class="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)]"
      ></div>
      <div class="relative z-10">
        <h1 class="text-4xl md:text-5xl font-bold text-white mb-4">
          📊 Workout Statistics
        </h1>
        <p class="text-lg text-emerald-100">
          Track your strength progression and celebrate your achievements
        </p>
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
          class="absolute inset-0 rounded-full border-4 border-transparent border-t-emerald-500 border-r-teal-500 animate-spin"
        ></div>
      </div>
      <p class="text-slate-600 dark:text-slate-400 font-medium">
        Loading statistics...
      </p>
    </div>

    <!-- Empty State -->
    <div v-else-if="workoutPlans.length === 0" class="text-center py-20">
      <div
        class="mb-6 inline-block p-6 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30"
      >
        <div class="text-6xl">📊</div>
      </div>
      <h3 class="text-2xl font-bold text-slate-900 dark:text-white mb-3">
        No data available
      </h3>
      <p class="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
        Create a workout plan and add exercises with their weight progress to view your statistics
      </p>
      <NuxtLink to="/">
        <UButton
          size="lg"
          class="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
        >
          Go to Workout Plans
        </UButton>
      </NuxtLink>
    </div>

    <!-- Statistics -->
    <div v-else class="space-y-8">
      <!-- Workout Plan Navigation Tabs -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          v-for="workoutPlan in workoutPlans"
          :key="workoutPlan.id"
          @click="selectedWorkoutPlanId = workoutPlan.id"
          :class="[
            'relative p-4 rounded-lg font-semibold transition-all duration-300 text-left group overflow-hidden',
            selectedWorkoutPlanId === workoutPlan.id
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-2 border-slate-200 dark:border-slate-700 hover:border-emerald-500',
          ]"
        >
          <div class="relative z-10">
            <span class="flex items-center gap-2"> 💪 {{ workoutPlan.name }} </span>
            <p class="text-sm opacity-75 mt-1">
              {{ workoutStore.exercisesByWorkoutPlan(workoutPlan.id).length }} exercises
            </p>
          </div>
          <div
            v-if="selectedWorkoutPlanId === workoutPlan.id"
            class="absolute inset-0 bg-white/10 animate-pulse"
          ></div>
        </button>
      </div>

      <!-- Selected Workout Plan Statistics -->
      <div v-if="selectedWorkoutPlan && exerciseStats.length > 0" class="space-y-8">
        <!-- KPI Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="relative group">
            <div
              class="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl blur opacity-0 group-hover:opacity-75 transition duration-500"
            ></div>
            <div
              class="relative bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700"
            >
              <div class="flex items-center justify-between">
                <div>
                  <p
                    class="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide"
                  >
                    Exercises
                  </p>
                  <p
                    class="text-4xl font-bold text-blue-600 dark:text-blue-400 mt-2"
                  >
                    {{ exerciseStats.length }}
                  </p>
                </div>
                <div class="text-4xl opacity-20">💪</div>
              </div>
            </div>
          </div>

          <div class="relative group">
            <div
              class="absolute inset-0 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl blur opacity-0 group-hover:opacity-75 transition duration-500"
            ></div>
            <div
              class="relative bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700"
            >
              <div class="flex items-center justify-between">
                <div>
                  <p
                    class="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide"
                  >
                    Total Weight
                  </p>
                  <p
                    class="text-4xl font-bold text-purple-600 dark:text-purple-400 mt-2"
                  >
                    {{ totalWeight }}<span class="text-lg"> kg</span>
                  </p>
                </div>
                <div class="text-4xl opacity-20">📦</div>
              </div>
            </div>
          </div>

          <div class="relative group">
            <div
              class="absolute inset-0 rounded-xl blur opacity-0 transition duration-500"
              :class="
                avgTrend > 0
                  ? 'bg-gradient-to-r from-green-500 to-green-600 group-hover:opacity-75'
                  : 'bg-gradient-to-r from-orange-500 to-orange-600 group-hover:opacity-75'
              "
            ></div>
            <div
              class="relative bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700"
            >
              <div class="flex items-center justify-between">
                <div>
                  <p
                    class="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide"
                  >
                    Average Trend
                  </p>
                  <p
                    :class="[
                      'text-4xl font-bold mt-2',
                      avgTrend > 0
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-orange-600 dark:text-orange-400',
                    ]"
                  >
                    {{ avgTrend > 0 ? "+" : "" }}{{ avgTrend.toFixed(2)
                    }}<span class="text-lg"> kg</span>
                  </p>
                </div>
                <div class="text-4xl" :class="avgTrend > 0 ? '' : 'opacity-20'">
                  📈
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Exercises Details -->
        <div>
          <h3
            class="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2"
          >
            <span
              class="w-1 h-8 bg-gradient-to-b from-emerald-600 to-teal-600 rounded-full"
            ></span>
            Exercise Details
          </h3>

          <div class="space-y-6">
            <div
              v-for="(exStat, idx) in exerciseStats"
              :key="exStat.id"
              class="group"
              :style="{ '--animation-delay': `${idx * 100}ms` }"
            >
              <div
                class="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500 -z-10"
              ></div>

              <div
                class="relative bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 space-y-6 hover:shadow-xl transition-shadow"
              >
                <!-- Header -->
                <div class="flex items-start justify-between">
                  <div>
                    <h4
                      class="text-xl font-bold text-slate-900 dark:text-white"
                    >
                      {{ exStat.name }}
                    </h4>
                    <p class="text-sm text-slate-500 dark:text-slate-500 mt-1">
                      📌 {{ exStat.equipment }}
                    </p>
                  </div>
                  <div
                    :class="[
                      'px-3 py-1 rounded-full text-sm font-bold',
                      exStat.totalIncrement > 0
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                        : exStat.totalIncrement < 0
                          ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
                          : 'bg-slate-100 dark:bg-slate-900/30 text-slate-700 dark:text-slate-400',
                    ]"
                  >
                    {{
                      exStat.totalIncrement > 0
                        ? "📈"
                        : exStat.totalIncrement < 0
                          ? "📉"
                          : "➡️"
                    }}
                    {{ exStat.totalIncrement > 0 ? "+" : ""
                    }}{{ exStat.totalIncrement.toFixed(2) }} kg
                  </div>
                </div>

                <!-- Weight Progression Chart -->
                <div
                  class="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800 p-6 rounded-lg"
                >
                  <p
                    class="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase mb-4"
                  >
                    Weight Progression (last 6 months)
                  </p>
                  <div class="flex items-end justify-between gap-2 h-32">
                    <div
                      v-for="(record, barIdx) in exStat.history.slice(-6)"
                      :key="barIdx"
                      class="flex-1 flex flex-col items-center"
                    >
                      <div
                        :style="{
                          height: `${(record.weight / Math.max(...exStat.history.map((r) => r.weight))) * 100}%`,
                          minHeight: '8px',
                        }"
                        class="w-full bg-gradient-to-t from-emerald-500 to-teal-400 dark:from-emerald-600 dark:to-teal-500 rounded-t-lg hover:from-emerald-600 hover:to-teal-500 transition-all cursor-help transform hover:scale-105"
                        :title="`${record.weight}kg - ${new Date(record.date).toLocaleDateString('en-US')}`"
                      />
                      <p
                        class="text-xs text-slate-600 dark:text-slate-400 mt-2 whitespace-nowrap font-medium"
                      >
                        {{
                          new Date(record.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })
                        }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Weight Stats Grid -->
                <div class="grid grid-cols-2 gap-4">
                  <div
                    class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800"
                  >
                    <p
                      class="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase"
                    >
                      Initial Weight
                    </p>
                    <p
                      class="text-2xl font-bold text-blue-900 dark:text-blue-100 mt-1"
                    >
                      {{ exStat.history[0]?.weight || 0 }}
                      <span class="text-sm font-normal">kg</span>
                    </p>
                  </div>

                  <div
                    class="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg border border-emerald-200 dark:border-emerald-800"
                  >
                    <p
                      class="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase"
                    >
                      Current Weight
                    </p>
                    <p
                      class="text-2xl font-bold text-emerald-900 dark:text-emerald-100 mt-1"
                    >
                      {{ exStat.current_weight }}
                      <span class="text-sm font-normal">kg</span>
                    </p>
                  </div>

                  <div
                    class="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800"
                  >
                    <p
                      class="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase"
                    >
                      Records
                    </p>
                    <p
                      class="text-2xl font-bold text-purple-900 dark:text-purple-100 mt-1"
                    >
                      {{ exStat.history.length }}
                    </p>
                  </div>

                  <div
                    :class="[
                      'p-4 rounded-lg border',
                      exStat.totalIncrement > 0
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                        : exStat.totalIncrement < 0
                          ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800'
                          : 'bg-slate-50 dark:bg-slate-900/20 border-slate-200 dark:border-slate-800',
                    ]"
                  >
                    <p
                      :class="[
                        'text-xs font-bold uppercase',
                        exStat.totalIncrement > 0
                          ? 'text-green-600 dark:text-green-400'
                          : exStat.totalIncrement < 0
                            ? 'text-orange-600 dark:text-orange-400'
                            : 'text-slate-600 dark:text-slate-400',
                      ]"
                    >
                      Total Increase
                    </p>
                    <p
                      :class="[
                        'text-2xl font-bold mt-1',
                        exStat.totalIncrement > 0
                          ? 'text-green-900 dark:text-green-100'
                          : exStat.totalIncrement < 0
                            ? 'text-orange-900 dark:text-orange-100'
                            : 'text-slate-900 dark:text-slate-100',
                      ]"
                    >
                      {{ exStat.totalIncrement > 0 ? "+" : ""
                      }}{{ exStat.totalIncrement.toFixed(2) }}
                      <span class="text-sm font-normal">kg</span>
                    </p>
                  </div>
                </div>

                <!-- Recent Updates -->
                <div
                  v-if="exStat.history.length > 0"
                  class="border-t border-slate-200 dark:border-slate-700 pt-6"
                >
                  <p
                    class="text-sm font-bold text-slate-900 dark:text-white uppercase mb-4 flex items-center gap-2"
                  >
                    <span
                      class="w-1 h-4 bg-gradient-to-b from-emerald-600 to-teal-600 rounded-full"
                    ></span>
                    Latest Updates
                  </p>
                  <div class="space-y-2">
                    <div
                      v-for="(record, updateIdx) in exStat.history
                        .slice(-3)
                        .reverse()"
                      :key="updateIdx"
                      class="flex justify-between items-center text-sm bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-700/50 p-4 rounded-lg border border-slate-200 dark:border-slate-600 hover:shadow-md transition"
                    >
                      <span
                        class="text-slate-600 dark:text-slate-400 font-medium"
                      >
                        📅
                        {{
                          new Date(record.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        }}
                      </span>
                      <span
                        class="font-bold text-slate-900 dark:text-white text-lg"
                        >{{ record.weight }} <span class="text-sm">kg</span></span
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- No Exercises in Selected Workout Plan -->
      <div v-else-if="selectedWorkoutPlan" class="text-center py-20">
        <div
          class="mb-6 inline-block p-6 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30"
        >
          <div class="text-6xl">📋</div>
        </div>
        <h3 class="text-2xl font-bold text-slate-900 dark:text-white mb-3">
          {{ selectedWorkoutPlan.name }} - No data
        </h3>
        <p class="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
          Add exercises to this workout plan to view statistics and track your progress
        </p>
        <NuxtLink :to="`/workout-plans/${selectedWorkoutPlan.id}`">
          <UButton
            size="lg"
            class="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
          >
            Add Exercises
          </UButton>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useWorkoutStore } from "~/stores/workoutStore";

const workoutStore = useWorkoutStore();
const { supabase } = useSupabase();

const loading = ref(false);
const selectedWorkoutPlanId = ref<string | null>(null);

const workoutPlans = computed(() => workoutStore.workoutPlans);
const selectedWorkoutPlan = computed(() =>
  selectedWorkoutPlanId.value
    ? workoutStore.workoutPlanById(selectedWorkoutPlanId.value)
    : null,
);

const exerciseStats = computed(() => {
  if (!selectedWorkoutPlanId.value) return [];

  return workoutStore
    .exercisesByWorkoutPlan(selectedWorkoutPlanId.value)
    .map((exercise) => {
      const history = workoutStore.historyByExercise(exercise.id);
      const initialWeight =
        history.length > 0 ? history[history.length - 1].weight : 0;
      const totalIncrement = exercise.current_weight - initialWeight;

      return {
        ...exercise,
        history: history.reverse(), // from oldest to most recent
        totalIncrement,
      };
    });
});

const totalWeight = computed(() => {
  return exerciseStats.value
    .reduce((sum, es) => sum + es.current_weight, 0)
    .toFixed(2);
});

const avgTrend = computed(() => {
  if (exerciseStats.value.length === 0) return 0;
  const totalTrend = exerciseStats.value.reduce(
    (sum, es) => sum + es.totalIncrement,
    0,
  );
  return totalTrend / exerciseStats.value.length;
});

onMounted(async () => {
  loading.value = true;
  try {
    const { data: workoutPlansData, error: workoutPlansError } = await supabase
      .from("workout_plans")
      .select("*")
      .order("created_at", { ascending: false });

    if (workoutPlansError) throw workoutPlansError;
    workoutStore.setWorkoutPlans(workoutPlansData || []);

    if (workoutPlansData && workoutPlansData.length > 0) {
      selectedWorkoutPlanId.value = workoutPlansData[0].id;
    }

    const { data: exercisesData, error: exercisesError } = await supabase
      .from("exercises")
      .select("*");

    if (exercisesError) throw exercisesError;
    workoutStore.setExercises(exercisesData || []);

    const { data: weightHistoryData, error: weightHistoryError } = await supabase
      .from("weight_history")
      .select("*")
      .order("date", { ascending: true });

    if (weightHistoryError) throw weightHistoryError;
    workoutStore.setWeightHistory(weightHistoryData || []);
  } catch (error) {
    console.error("Error loading statistics:", error);
  } finally {
    loading.value = false;
  }
});
</script>
