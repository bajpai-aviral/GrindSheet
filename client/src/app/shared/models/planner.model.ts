export interface Planner {
  id: string;
  name: string;
  active: boolean;
  createdAt: string;
  days: PlanDay[];
}

export interface PlanDay {
  id: string;
  dayOfWeek: string;
  label: string;
  exercises: PlanExercise[];
}

export interface PlanExercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  exerciseOrder: number;
}

export interface PlannerRequest {
  name: string;
}

export interface PlanDayRequest {
  dayOfWeek: string;
  label: string;
}

export interface PlanExerciseRequest {
  name: string;
  sets: number;
  reps: number;
  exerciseOrder: number;
}