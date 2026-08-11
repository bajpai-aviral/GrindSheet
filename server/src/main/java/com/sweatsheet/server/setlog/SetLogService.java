package com.sweatsheet.server.setlog;

import com.sweatsheet.server.planner.PlanExercise;
import com.sweatsheet.server.planner.PlanExerciseRepository;
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
public class SetLogService {

    private final SetLogRepository setLogRepository;
    private final WorkoutLogRepository workoutLogRepository;
    private final PlanExerciseRepository planExerciseRepository;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private SetLogResponse toResponse(SetLog setLog) {
        return SetLogResponse.builder()
                .id(setLog.getId())
                .workoutLogId(setLog.getWorkoutLog().getId())
                .planExerciseId(setLog.getPlanExercise().getId())
                .exerciseName(setLog.getPlanExercise().getName())
                .setNumber(setLog.getSetNumber())
                .weightUsed(setLog.getWeightUsed())
                .notes(setLog.getNotes())
                .build();
    }

    public SetLogResponse logSet(SetLogRequest request) {
        User user = getCurrentUser();

        WorkoutLog workoutLog = workoutLogRepository
                .findById(request.getWorkoutLogId())
                .orElseThrow(() -> new RuntimeException("Workout log not found"));

        if (!workoutLog.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Not authorized to log to this workout");
        }

        PlanExercise planExercise = planExerciseRepository
                .findById(request.getPlanExerciseId())
                .orElseThrow(() -> new RuntimeException("Plan exercise not found"));

        setLogRepository.findByWorkoutLogIdAndPlanExerciseIdAndSetNumber(
                request.getWorkoutLogId(),
                request.getPlanExerciseId(),
                request.getSetNumber()
        ).ifPresent(existing -> setLogRepository.deleteById(existing.getId()));

        SetLog setLog = SetLog.builder()
                .workoutLog(workoutLog)
                .planExercise(planExercise)
                .setNumber(request.getSetNumber())
                .weightUsed(request.getWeightUsed())
                .notes(request.getNotes())
                .build();

        return toResponse(setLogRepository.save(setLog));
    }

    public List<SetLogResponse> getSetLogsByWorkoutLog(UUID workoutLogId) {
        User user = getCurrentUser();

        WorkoutLog workoutLog = workoutLogRepository.findById(workoutLogId)
                .orElseThrow(() -> new RuntimeException("Workout log not found"));

        if (!workoutLog.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Not authorized to view this workout");
        }

        return setLogRepository.findAllByWorkoutLogId(workoutLogId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public SetLogResponse updateSetLog(UUID id, SetLogRequest request) {
        User user = getCurrentUser();

        SetLog setLog = setLogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Set log not found"));

        if (!setLog.getWorkoutLog().getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Not authorized to update this set log");
        }

        setLog.setWeightUsed(request.getWeightUsed());
        setLog.setNotes(request.getNotes());

        return toResponse(setLogRepository.save(setLog));
    }

    public void deleteSetLog(UUID id) {
        User user = getCurrentUser();

        SetLog setLog = setLogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Set log not found"));

        if (!setLog.getWorkoutLog().getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Not authorized to delete this set log");
        }

        setLogRepository.deleteById(id);
    }
}