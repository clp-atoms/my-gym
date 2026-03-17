import { defineStore } from "pinia";

interface Exercise {
  id: string;
  workout_plan_id: string;
  name: string;
  equipment: string;
  description?: string;
  sets: number;
  reps: number;
  current_weight: number;
  rest_time: number; // in minutes
  duration: number; // in minutes
}

interface WeightHistory {
  id: string;
  exercise_id: string;
  weight: number;
  date: string;
}

interface ExerciseHistoryRecord {
  id: string;
  exercise_id: string;
  weight: number;
  sets: number;
  reps: number;
  rest_time: number;
  duration: number;
  date: string;
}

interface WorkoutPlan {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  exercises?: Exercise[];
}

export const useWorkoutStore = defineStore("workout", {
  state: () => ({
    workoutPlans: [] as WorkoutPlan[],
    exercises: [] as Exercise[],
    weightHistory: [] as WeightHistory[],
    exerciseHistory: [] as ExerciseHistoryRecord[],
    lastWorkoutPlanId: null as string | null,
    loading: false,
    error: null as string | null,
  }),

  getters: {
    workoutPlanById: (state) => (id: string) => {
      return state.workoutPlans.find((s) => s.id === id);
    },

    lastWorkoutPlan: (state) => {
      if (state.lastWorkoutPlanId) {
        const found = state.workoutPlans.find(
          (s) => s.id === state.lastWorkoutPlanId,
        );
        if (found) return found;
      }
      // Fallback: return the first workout plan if lastWorkoutPlanId is not set or not found
      return state.workoutPlans.length > 0 ? state.workoutPlans[0] : null;
    },

    exercisesByWorkoutPlan: (state) => (workoutPlanId: string) => {
      return state.exercises.filter((e) => e.workout_plan_id === workoutPlanId);
    },

    historyByExercise: (state) => (exerciseId: string) => {
      return state.weightHistory
        .filter((c) => c.exercise_id === exerciseId)
        .sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        );
    },

    exerciseHistoryByExercise: (state) => (exerciseId: string) => {
      return state.exerciseHistory
        .filter((c) => c.exercise_id === exerciseId)
        .sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        );
    },

    exerciseMetricsTrend: (state) => (exerciseId: string) => {
      const history = state.exerciseHistory
        .filter((c) => c.exercise_id === exerciseId)
        .sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        );

      if (history.length < 2) {
        return {
          weight: 0,
          sets: 0,
          reps: 0,
          rest_time: 0,
          duration: 0,
        };
      }

      const last = history[history.length - 1];
      const secondLast = history[history.length - 2];

      return {
        weight: last.weight - secondLast.weight,
        sets: last.sets - secondLast.sets,
        reps: last.reps - secondLast.reps,
        rest_time: last.rest_time - secondLast.rest_time,
        duration: last.duration - secondLast.duration,
      };
    },
  },

  actions: {
    setLoading(value: boolean) {
      this.loading = value;
    },

    setError(error: string | null) {
      this.error = error;
    },

    setWorkoutPlans(workoutPlans: WorkoutPlan[]) {
      this.workoutPlans = workoutPlans;
    },

    setExercises(exercises: Exercise[]) {
      this.exercises = exercises;
    },

    setWeightHistory(weightHistory: WeightHistory[]) {
      this.weightHistory = weightHistory;
    },

    setExerciseHistory(exerciseHistory: ExerciseHistoryRecord[]) {
      this.exerciseHistory = exerciseHistory;
    },

    addWorkoutPlan(workoutPlan: WorkoutPlan) {
      this.workoutPlans.push(workoutPlan);
    },

    addExercise(exercise: Exercise) {
      this.exercises.push(exercise);
    },

    addWeightRecord(record: WeightHistory) {
      this.weightHistory.push(record);
    },

    addExerciseHistoryRecord(record: ExerciseHistoryRecord) {
      this.exerciseHistory.push(record);
    },

    updateExerciseWeight(exerciseId: string, newWeight: number) {
      const exercise = this.exercises.find((e) => e.id === exerciseId);
      if (exercise) {
        exercise.current_weight = newWeight;
      }
    },

    deleteWorkoutPlan(workoutPlanId: string) {
      this.workoutPlans = this.workoutPlans.filter(
        (s) => s.id !== workoutPlanId,
      );
      this.exercises = this.exercises.filter(
        (e) => e.workout_plan_id !== workoutPlanId,
      );
    },

    deleteExercise(exerciseId: string) {
      this.exercises = this.exercises.filter((e) => e.id !== exerciseId);
    },

    async setLastWorkoutPlanId(workoutPlanId: string | null) {
      this.lastWorkoutPlanId = workoutPlanId;

      try {
        const { supabase } = useSupabase();
        const authStore = useAuthStore();

        if (authStore.userId) {
          const { error } = await supabase.from("user_preferences").upsert(
            {
              user_id: authStore.userId,
              last_workout_plan_id: workoutPlanId,
            },
            { onConflict: "user_id" },
          );

          if (error) {
            console.error("Error saving last workout plan to DB:", error);
          }
        }
      } catch (error) {
        console.error("Error in setLastWorkoutPlanId:", error);
      }
    },

    async loadLastWorkoutPlanId() {
      try {
        const { supabase } = useSupabase();
        const authStore = useAuthStore();

        // Ensure user is authenticated and session is ready
        if (!authStore.userId) {
          console.debug("User not authenticated yet, skipping load");
          return;
        }

        // Verify session exists
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session) {
          console.debug("No active session, skipping load");
          return;
        }

        const { data, error } = await supabase
          .from("user_preferences")
          .select("last_workout_plan_id")
          .eq("user_id", authStore.userId)
          .single();

        if (error) {
          // If no preference found, that's OK (first time user)
          if (error.code !== "PGRST116") {
            console.error("Error loading last workout plan from DB:", error);
          }
          return;
        }

        if (data?.last_workout_plan_id) {
          this.lastWorkoutPlanId = data.last_workout_plan_id;
        }
      } catch (error) {
        console.error("Error in loadLastWorkoutPlanId:", error);
      }
    },
  },
});
