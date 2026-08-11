package com.sweatsheet.server.exercise;

import com.sweatsheet.server.user.User;
import com.sweatsheet.server.user.UserRepository;
import com.sweatsheet.server.workout.WorkoutLog;
import com.sweatsheet.server.workout.WorkoutLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExerciseService {

    private final ExerciseRepository exerciseRepository;
    private final WorkoutLogRepository workoutLogRepository;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private ExerciseResponse toResponse(Exercise exercise) {
        return ExerciseResponse.builder()
                .id(exercise.getId())
                .logId(exercise.getWorkoutLog().getId())
                .name(exercise.getName())
                .sets(exercise.getSets())
                .reps(exercise.getReps())
                .weight(exercise.getWeight())
                .notes(exercise.getNotes())
                .build();
    }

    public List<ExerciseResponse> getExercisesByLogId(UUID logId) {
        User user = getCurrentUser();
        WorkoutLog log = workoutLogRepository.findById(logId)
                .orElseThrow(() -> new RuntimeException("Workout log not found"));

        if (!log.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You are not authorized to view these exercises");
        }

        return exerciseRepository.findAllByWorkoutLogId(logId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public ExerciseResponse addExercise(ExerciseRequest request) {
        User user = getCurrentUser();
        WorkoutLog log = workoutLogRepository.findById(request.getLogId())
                .orElseThrow(() -> new RuntimeException("Workout log not found"));

        if (!log.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You are not authorized to add exercises to this log");
        }

        Exercise exercise = Exercise.builder()
                .workoutLog(log)
                .name(request.getName())
                .sets(request.getSets())
                .reps(request.getReps())
                .weight(request.getWeight())
                .notes(request.getNotes())
                .build();

        return toResponse(exerciseRepository.save(exercise));
    }

    public ExerciseResponse updateExercise(UUID id, ExerciseRequest request) {
        User user = getCurrentUser();
        Exercise exercise = exerciseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Exercise not found"));

        if (!exercise.getWorkoutLog().getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You are not authorized to edit this exercise");
        }

        exercise.setName(request.getName());
        exercise.setSets(request.getSets());
        exercise.setReps(request.getReps());
        exercise.setWeight(request.getWeight());
        exercise.setNotes(request.getNotes());

        return toResponse(exerciseRepository.save(exercise));
    }

    public void deleteExercise(UUID id) {
        User user = getCurrentUser();
        Exercise exercise = exerciseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Exercise not found"));

        if (!exercise.getWorkoutLog().getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You are not authorized to delete this exercise");
        }

        exerciseRepository.deleteById(id);
    }
}