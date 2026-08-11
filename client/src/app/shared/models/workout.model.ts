export interface WorkoutLog {
  id: string;
  date: string;
  createdAt: string;
  userId: string;
  userName: string;
}

export interface SetLogRequest {
  workoutLogId: string;
  planExerciseId: string;
  setNumber: number;
  weightUsed: number;
  notes: string;
}

export interface SetLogResponse {
  id: string;
  workoutLogId: string;
  planExerciseId: string;
  exerciseName: string;
  setNumber: number;
  weightUsed: number;
  notes: string;
}

export interface SetScreenResponse {
  setNumber: number;
  reps: number;
  previousWeight: number | null;
  loggedWeight: number | null;
  previousWeekMessage: string | null;
}

export interface ExerciseScreenResponse {
  planExerciseId: string;
  name: string;
  totalSets: number;
  reps: number;
  sets: SetScreenResponse[];
}

export interface DailyScreenResponse {
  workoutLogId: string;
  date: string;
  dayLabel: string;
  plannerName: string;
  exercises: ExerciseScreenResponse[];
}

export interface SetCompareResponse {
  setNumber: number;
  reps: number;
  currentWeight: number | null;
  previousWeight: number | null;
  weightDifference: number | null;
  message: string | null;
}

export interface ExerciseCompareResponse {
  planExerciseId: string;
  name: string;
  sets: SetCompareResponse[];
}

export interface CompareResponse {
  currentDate: string;
  comparedToDate: string;
  weeksBack: number;
  plannerName: string;
  dayLabel: string;
  exercises: ExerciseCompareResponse[];
}

export interface PastRecordResponse {
  workoutLogId: string;
  date: string;
  dayLabel: string;
  plannerName: string;
  exercises: ExerciseScreenResponse[];
}