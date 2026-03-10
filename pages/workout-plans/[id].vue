<template>
  <div class="space-y-8">
    <!-- Back Button & Header -->
    <div class="flex items-center gap-4">
      <NuxtLink to="/">
        <UButton
          icon="i-heroicons-arrow-left-20-solid"
          color="gray"
          variant="ghost"
        >
          Back
        </UButton>
      </NuxtLink>
      <div>
        <h1 class="text-3xl font-bold text-slate-900 dark:text-white">
          {{ workoutPlan?.name }}
        </h1>
        <p
          v-if="workoutPlan?.description"
          class="text-slate-600 dark:text-slate-400 mt-1"
        >
          {{ workoutPlan.description }}
        </p>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="text-slate-600 dark:text-slate-400">Loading...</div>
    </div>

    <!-- Content -->
    <div v-else-if="workoutPlan" class="space-y-6">
      <!-- Add Exercise Button -->
      <UButton
        icon="i-heroicons-plus-20-solid"
        size="lg"
        @click="isModalExerciseOpen = true"
      >
        Add Exercise
      </UButton>

      <!-- Empty State -->
      <div
        v-if="exercises.length === 0"
        class="text-center py-16 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700"
      >
        <div class="text-6xl mb-4">🏋️</div>
        <h3 class="text-xl font-semibold text-slate-900 dark:text-white mb-2">
          No exercises
        </h3>
        <p class="text-slate-600 dark:text-slate-400 mb-6">
          Add the first exercise to this workout plan
        </p>
      </div>

      <!-- Exercises List -->
      <div v-else class="space-y-4">
        <div
          v-for="exercise in exercises"
          :key="exercise.id"
          class="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 hover:shadow-md transition"
        >
          <div class="flex justify-between items-start mb-4">
            <div>
              <h3 class="text-lg font-semibold text-slate-900 dark:text-white">
                {{ exercise.name }}
              </h3>
              <p class="text-sm text-slate-600 dark:text-slate-400 mt-1">
                🔧 {{ exercise.equipment }}
              </p>
              <p
                v-if="exercise.description"
                class="text-sm text-slate-500 dark:text-slate-500 mt-2"
              >
                {{ exercise.description }}
              </p>
            </div>
            <div class="flex gap-2">
              <UButton
                color="blue"
                variant="ghost"
                icon="i-heroicons-pencil-20-solid"
                @click="openEditExercise(exercise)"
              />
              <UButton
                color="red"
                variant="ghost"
                icon="i-heroicons-trash-20-solid"
                @click="deleteExercise(exercise.id)"
              />
            </div>
          </div>

          <!-- Exercise Info Grid -->
          <div class="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
            <div class="bg-slate-50 dark:bg-slate-700 p-3 rounded-lg">
              <p
                class="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase"
              >
                Sets
              </p>
              <p class="text-xl font-bold text-slate-900 dark:text-white mt-1">
                {{ exercise.sets }}
              </p>
            </div>
            <div class="bg-slate-50 dark:bg-slate-700 p-3 rounded-lg">
              <p
                class="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase"
              >
                Reps
              </p>
              <p class="text-xl font-bold text-slate-900 dark:text-white mt-1">
                {{ exercise.reps }}
              </p>
            </div>
            <div class="bg-slate-50 dark:bg-slate-700 p-3 rounded-lg">
              <p
                class="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase"
              >
                Weight
              </p>
              <div class="flex items-baseline gap-1 mt-1">
                <p class="text-xl font-bold text-slate-900 dark:text-white">
                  {{ exercise.current_weight }}
                </p>
                <p class="text-xs text-slate-600 dark:text-slate-400">kg</p>
              </div>
            </div>
            <div class="bg-slate-50 dark:bg-slate-700 p-3 rounded-lg">
              <p
                class="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase"
              >
                Rest Time
              </p>
              <div class="flex items-baseline gap-1 mt-1">
                <p class="text-xl font-bold text-slate-900 dark:text-white">
                  {{ exercise.rest_time }}
                </p>
                <p class="text-xs text-slate-600 dark:text-slate-400">min</p>
              </div>
            </div>
            <div class="bg-slate-50 dark:bg-slate-700 p-3 rounded-lg">
              <p
                class="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase"
              >
                Duration
              </p>
              <div class="flex items-baseline gap-1 mt-1">
                <p class="text-xl font-bold text-slate-900 dark:text-white">
                  {{ exercise.duration }}
                </p>
                <p class="text-xs text-slate-600 dark:text-slate-400">min</p>
              </div>
            </div>
          </div>

          <!-- Trend Indicator -->
          <div v-if="getTrend(exercise.id) !== 0" class="mb-6">
            <div
              :class="[
                'flex items-center gap-2 p-3 rounded-lg',
                getTrend(exercise.id) > 0
                  ? 'bg-green-50 dark:bg-green-900/20'
                  : 'bg-orange-50 dark:bg-orange-900/20',
              ]"
            >
              <span v-if="getTrend(exercise.id) > 0" class="text-xl">📈</span>
              <span v-else class="text-xl">📉</span>
              <span
                :class="[
                  'font-semibold',
                  getTrend(exercise.id) > 0
                    ? 'text-green-700 dark:text-green-300'
                    : 'text-orange-700 dark:text-orange-300',
                ]"
              >
                {{ getTrend(exercise.id) > 0 ? "+" : ""
                }}{{ getTrend(exercise.id) }} kg
              </span>
              <span class="text-sm text-slate-600 dark:text-slate-400"
                >since last time</span
              >
            </div>
          </div>

          <!-- Update Weight Button -->
          <UButton
            icon="i-heroicons-arrow-trending-up-20-solid"
            color="blue"
            block
            @click="openUpdateWeight(exercise)"
          >
            Update Weight
          </UButton>
        </div>
      </div>
    </div>

    <!-- Modal New Exercise -->
    <UModal v-model:open="isModalExerciseOpen">
      <template #header>
        <h2 class="text-lg font-semibold">New Exercise</h2>
      </template>

      <template #body>
        <div class="space-y-4 flex-1 overflow-y-auto">
          <div>
            <label
              class="block text-sm font-medium text-slate-900 dark:text-white mb-2"
            >
              Exercise Name
            </label>
            <input
              v-model="newExercise.name"
              type="text"
              placeholder="e.g. Bench Press"
              class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              class="block text-sm font-medium text-slate-900 dark:text-white mb-2"
            >
              Equipment
            </label>
            <input
              v-model="newExercise.equipment"
              type="text"
              placeholder="e.g. Dumbbells, Bench, Barbell"
              class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              class="block text-sm font-medium text-slate-900 dark:text-white mb-2"
            >
              Description (optional)
            </label>
            <textarea
              v-model="newExercise.description"
              placeholder="e.g. Exercise for chest and triceps..."
              rows="2"
              class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label
                class="block text-sm font-medium text-slate-900 dark:text-white mb-2"
              >
                Sets
              </label>
              <input
                v-model.number="newExercise.sets"
                type="number"
                placeholder="3"
                min="0"
                class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label
                class="block text-sm font-medium text-slate-900 dark:text-white mb-2"
              >
                Reps
              </label>
              <input
                v-model.number="newExercise.reps"
                type="number"
                placeholder="10"
                min="0"
                class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label
              class="block text-sm font-medium text-slate-900 dark:text-white mb-2"
            >
              Weight (kg)
            </label>
            <input
              v-model.number="newExercise.current_weight"
              type="number"
              placeholder="20"
              min="0"
              step="0.5"
              class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label
                class="block text-sm font-medium text-slate-900 dark:text-white mb-2"
              >
                Rest Time (min)
              </label>
              <input
                v-model.number="newExercise.rest_time"
                type="number"
                placeholder="1"
                min="0"
                step="0.5"
                class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label
                class="block text-sm font-medium text-slate-900 dark:text-white mb-2"
              >
                Duration (min)
              </label>
              <input
                v-model.number="newExercise.duration"
                type="number"
                placeholder="10"
                min="0"
                step="0.5"
                class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </template>

      <template #footer>
        <div class="flex gap-3 justify-end">
          <UButton
            color="gray"
            variant="ghost"
            @click="isModalExerciseOpen = false"
          >
            Cancel
          </UButton>
          <UButton
            color="blue"
            @click="createExercise"
            :disabled="!newExercise.name || !newExercise.equipment"
            :loading="creatingExercise"
          >
            Add
          </UButton>
        </div>
      </template>
    </UModal>

    <!-- Modal Edit Exercise -->
    <UModal v-model:open="isModalEditOpen">
      <template #header>
        <h2 class="text-lg font-semibold">Edit Exercise</h2>
      </template>

      <template #body>
        <div v-if="editingExercise" class="space-y-4 flex-1 overflow-y-auto">
          <div>
            <label
              class="block text-sm font-medium text-slate-900 dark:text-white mb-2"
            >
              Exercise Name
            </label>
            <input
              v-model="editingExercise.name"
              type="text"
              placeholder="e.g. Bench Press"
              class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              class="block text-sm font-medium text-slate-900 dark:text-white mb-2"
            >
              Equipment
            </label>
            <input
              v-model="editingExercise.equipment"
              type="text"
              placeholder="e.g. Dumbbells, Bench, Barbell"
              class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              class="block text-sm font-medium text-slate-900 dark:text-white mb-2"
            >
              Description (optional)
            </label>
            <textarea
              v-model="editingExercise.description"
              placeholder="e.g. Exercise for chest and triceps..."
              rows="2"
              class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label
                class="block text-sm font-medium text-slate-900 dark:text-white mb-2"
              >
                Sets
              </label>
              <input
                v-model.number="editingExercise.sets"
                type="number"
                placeholder="3"
                min="0"
                class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label
                class="block text-sm font-medium text-slate-900 dark:text-white mb-2"
              >
                Reps
              </label>
              <input
                v-model.number="editingExercise.reps"
                type="number"
                placeholder="10"
                min="0"
                class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label
              class="block text-sm font-medium text-slate-900 dark:text-white mb-2"
            >
              Weight (kg)
            </label>
            <input
              v-model.number="editingExercise.current_weight"
              type="number"
              placeholder="20"
              min="0"
              step="0.5"
              class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label
                class="block text-sm font-medium text-slate-900 dark:text-white mb-2"
              >
                Rest Time (min)
              </label>
              <input
                v-model.number="editingExercise.rest_time"
                type="number"
                placeholder="1"
                min="0"
                step="0.5"
                class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label
                class="block text-sm font-medium text-slate-900 dark:text-white mb-2"
              >
                Duration (min)
              </label>
              <input
                v-model.number="editingExercise.duration"
                type="number"
                placeholder="10"
                min="0"
                step="0.5"
                class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </template>

      <template #footer>
        <div class="flex gap-3 justify-end">
          <UButton
            color="gray"
            variant="ghost"
            @click="isModalEditOpen = false"
          >
            Cancel
          </UButton>
          <UButton
            color="blue"
            @click="saveExerciseChanges"
            :disabled="!editingExercise?.name || !editingExercise?.equipment"
            :loading="updatingExercise"
          >
            Save
          </UButton>
        </div>
      </template>
    </UModal>

    <!-- Modal Update Weight -->
    <UModal v-model:open="isModalUpdateOpen">
      <template #header>
        <h2 class="text-lg font-semibold">
          Update Weight - {{ selectedExercise.name }}
        </h2>
      </template>

      <template #body>
        <div class="space-y-4 flex-1 overflow-y-auto">
          <div>
            <label
              class="block text-sm font-medium text-slate-900 dark:text-white mb-2"
            >
              New Weight (kg)
            </label>
            <input
              v-model.number="newWeight"
              type="number"
              placeholder="e.g. 25"
              min="0"
              step="0.5"
              class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
              autofocus
            />
          </div>

          <div class="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg">
            <p
              class="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase mb-2"
            >
              Comparison
            </p>
            <div class="flex justify-between items-center">
              <div>
                <p class="text-sm text-slate-600 dark:text-slate-400">
                  Current Weight
                </p>
                <p class="text-2xl font-bold text-slate-900 dark:text-white">
                  {{ selectedExercise.current_weight }} kg
                </p>
              </div>
              <div class="text-2xl">→</div>
              <div>
                <p class="text-sm text-slate-600 dark:text-slate-400">
                  New Weight
                </p>
                <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {{ newWeight }} kg
                </p>
              </div>
            </div>
            <div
              v-if="newWeight !== selectedExercise.current_weight"
              class="mt-3 pt-3 border-t border-slate-200 dark:border-slate-600"
            >
              <p
                :class="[
                  'font-semibold',
                  newWeight > selectedExercise.current_weight
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-orange-600 dark:text-orange-400',
                ]"
              >
                {{ newWeight > selectedExercise.current_weight ? "📈 +" : "📉 "
                }}{{ Math.abs(newWeight - selectedExercise.current_weight) }} kg
              </p>
            </div>
          </div>
        </div>
      </template>

      <template #footer>
        <div class="flex gap-3 justify-end">
          <UButton
            color="gray"
            variant="ghost"
            @click="isModalUpdateOpen = false"
          >
            Cancel
          </UButton>
          <UButton
            color="blue"
            @click="updateWeight"
            :disabled="
              newWeight === null ||
              newWeight === selectedExercise?.current_weight
            "
            :loading="updatingWeight"
          >
            Save
          </UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { useWorkoutStore } from "~/stores/workoutStore";

const route = useRoute();
const workoutStore = useWorkoutStore();
const { supabase } = useSupabase();

const loading = ref(false);
const isModalExerciseOpen = ref(false);
const isModalUpdateOpen = ref(false);
const isModalEditOpen = ref(false);
const creatingExercise = ref(false);
const updatingWeight = ref(false);
const updatingExercise = ref(false);

const workoutPlanId = route.params.id as string;

const newExercise = ref({
  name: "",
  equipment: "",
  description: "",
  sets: 0,
  reps: 0,
  current_weight: 0,
  rest_time: 0,
  duration: 0,
});

const selectedExercise = ref<any>(null);
const editingExercise = ref<any>(null);
const newWeight = ref<number | null>(null);

const workoutPlan = computed(() => workoutStore.workoutPlanById(workoutPlanId));
const exercises = computed(() => {
  const exercisesOfPlan = workoutStore.exercisesByWorkoutPlan(workoutPlanId);
  // Alphabetical natural order (where numbers are ordered numerically)
  return exercisesOfPlan.sort((a, b) => {
    return a.name.localeCompare(b.name, undefined, {
      numeric: true,
      sensitivity: "base",
    });
  });
});

onMounted(async () => {
  loading.value = true;
  try {
    const { data, error } = await supabase
      .from("exercises")
      .select("*")
      .eq("workout_plan_id", workoutPlanId);

    if (error) throw error;
    workoutStore.setExercises([
      ...workoutStore.exercises.filter((e) => e.workout_plan_id !== workoutPlanId),
      ...(data || []),
    ]);

    const { data: weightHistory, error: weightHistoryError } = await supabase
      .from("weight_history")
      .select("*");

    if (weightHistoryError) throw weightHistoryError;
    workoutStore.setWeightHistory(weightHistory || []);

    // Register this workout plan as the last one executed
    workoutStore.setLastWorkoutPlanId(workoutPlanId);
  } catch (error) {
    console.error("Error loading exercises:", error);
  } finally {
    loading.value = false;
  }
});

const createExercise = async () => {
  if (!newExercise.value.name || !newExercise.value.equipment) {
    alert("Please enter at least the exercise name and equipment.");
    return;
  }

  creatingExercise.value = true;
  try {
    const { data, error } = await supabase
      .from("exercises")
      .insert([
        {
          workout_plan_id: workoutPlanId,
          name: newExercise.value.name,
          equipment: newExercise.value.equipment,
          description: newExercise.value.description || null,
          sets: newExercise.value.sets || 0,
          reps: newExercise.value.reps || 0,
          current_weight: newExercise.value.current_weight || 0,
          rest_time: newExercise.value.rest_time || 0,
          duration: newExercise.value.duration || 0,
        },
      ])
      .select();

    if (error) throw error;
    if (data?.[0]) {
      workoutStore.addExercise(data[0]);

      // Add initial weight history entry
      await supabase.from("weight_history").insert([
        {
          exercise_id: data[0].id,
          weight: newExercise.value.current_weight || 0,
          date: new Date().toISOString(),
        },
      ]);

      newExercise.value = {
        name: "",
        equipment: "",
        description: "",
        sets: 0,
        reps: 0,
        current_weight: 0,
        rest_time: 0,
        duration: 0,
      };
      isModalExerciseOpen.value = false;
    }
  } catch (error) {
    console.error("Error creating exercise:", error);
  } finally {
    creatingExercise.value = false;
  }
};

const getTrend = (exerciseId: string) => {
  return workoutStore.weightTrend(exerciseId);
};

const openUpdateWeight = (exercise: any) => {
  selectedExercise.value = exercise;
  newWeight.value = exercise.current_weight;
  isModalUpdateOpen.value = true;
};

const openEditExercise = (exercise: any) => {
  editingExercise.value = { ...exercise };
  isModalEditOpen.value = true;
};

const saveExerciseChanges = async () => {
  if (
    !editingExercise.value ||
    !editingExercise.value.name ||
    !editingExercise.value.equipment
  )
    return;

  updatingExercise.value = true;
  try {
    const { error } = await supabase
      .from("exercises")
      .update({
        name: editingExercise.value.name,
        equipment: editingExercise.value.equipment,
        description: editingExercise.value.description || null,
        sets: editingExercise.value.sets || 0,
        reps: editingExercise.value.reps || 0,
        current_weight: editingExercise.value.current_weight || 0,
        rest_time: editingExercise.value.rest_time || 0,
        duration: editingExercise.value.duration || 0,
      })
      .eq("id", editingExercise.value.id);

    if (error) throw error;

    // Update store
    const exerciseIndex = workoutStore.exercises.findIndex(
      (e) => e.id === editingExercise.value.id,
    );
    if (exerciseIndex !== -1) {
      workoutStore.exercises[exerciseIndex] = { ...editingExercise.value };
    }

    isModalEditOpen.value = false;
    editingExercise.value = null;
  } catch (error) {
    console.error("Error updating exercise:", error);
  } finally {
    updatingExercise.value = false;
  }
};

const updateWeight = async () => {
  if (!selectedExercise.value || newWeight.value === null) return;

  updatingWeight.value = true;
  try {
    // Update exercise
    const { error: updateError } = await supabase
      .from("exercises")
      .update({ current_weight: newWeight.value })
      .eq("id", selectedExercise.value.id);

    if (updateError) throw updateError;

    // Add to weight history
    const { error: historyError } = await supabase
      .from("weight_history")
      .insert([
        {
          exercise_id: selectedExercise.value.id,
          weight: newWeight.value,
          date: new Date().toISOString(),
        },
      ]);

    if (historyError) throw historyError;

    workoutStore.updateExerciseWeight(
      selectedExercise.value.id,
      newWeight.value,
    );

    // Refresh history
    const { data: weightHistory } = await supabase
      .from("weight_history")
      .select("*");

    workoutStore.setWeightHistory(weightHistory || []);

    isModalUpdateOpen.value = false;
    selectedExercise.value = null;
    newWeight.value = null;
  } catch (error) {
    console.error("Error updating weight:", error);
  } finally {
    updatingWeight.value = false;
  }
};

const deleteExercise = async (exerciseId: string) => {
  const confirmed = confirm("Are you sure you want to delete this exercise?");
  if (!confirmed) return;

  try {
    const { error: deleteWeightHistoryError } = await supabase
      .from("weight_history")
      .delete()
      .eq("exercise_id", exerciseId);

    if (deleteWeightHistoryError) throw deleteWeightHistoryError;

    const { error } = await supabase
      .from("exercises")
      .delete()
      .eq("id", exerciseId);

    if (error) throw error;

    workoutStore.deleteExercise(exerciseId);
  } catch (error) {
    console.error("Error deleting exercise:", error);
  }
};
</script>
