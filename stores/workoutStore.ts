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
    lastWorkoutPlanId: null as string | null,
    loading: false,
    error: null as string | null,
  }),

  getters: {
    workoutPlanById: (state) => (id: string) => {
      return state.workoutPlans.find((s) => s.id === id);
    },

    lastWorkoutPlan: (state) => {
      if (!state.lastWorkoutPlanId) return null;
      return state.workoutPlans.find((s) => s.id === state.lastWorkoutPlanId);
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

    weightTrend: (state) => (exerciseId: string) => {
      const history = state.weightHistory
        .filter((c) => c.exercise_id === exerciseId)
        .sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        );

      if (history.length < 2) return 0;

      const last = history[history.length - 1].weight;
      const secondLast = history[history.length - 2].weight;

      return last - secondLast;
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

    addWorkoutPlan(workoutPlan: WorkoutPlan) {
      this.workoutPlans.push(workoutPlan);
    },

    addExercise(exercise: Exercise) {
      this.exercises.push(exercise);
    },

    addWeightRecord(record: WeightHistory) {
      this.weightHistory.push(record);
    },

    updateExerciseWeight(exerciseId: string, newWeight: number) {
      const exercise = this.exercises.find((e) => e.id === exerciseId);
      if (exercise) {
        exercise.current_weight = newWeight;
      }
    },

    deleteWorkoutPlan(workoutPlanId: string) {
      this.workoutPlans = this.workoutPlans.filter((s) => s.id !== workoutPlanId);
      this.exercises = this.exercises.filter((e) => e.workout_plan_id !== workoutPlanId);
    },

    deleteExercise(exerciseId: string) {
      this.exercises = this.exercises.filter((e) => e.id !== exerciseId);
    },

    setLastWorkoutPlanId(workoutPlanId: string | null) {
      this.lastWorkoutPlanId = workoutPlanId;
      if (process.client) {
        if (workoutPlanId) {
          localStorage.setItem("lastWorkoutPlanId", workoutPlanId);
        } else {
          localStorage.removeItem("lastWorkoutPlanId");
        }
      }
    },

    loadLastWorkoutPlanId() {
      if (process.client) {
        const savedScheduleId = localStorage.getItem("lastWorkoutPlanId");
        this.lastWorkoutPlanId = savedScheduleId;
      }
    },
  },
});
