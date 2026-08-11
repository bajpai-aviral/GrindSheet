package com.sweatsheet.server.workout;

import com.sweatsheet.server.user.User;
import com.sweatsheet.server.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WorkoutLogService {

    private final WorkoutLogRepository workoutLogRepository;
    private final UserRepository userRepository;

    // Get currently logged in user
    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // Convert entity to response DTO
    private WorkoutLogResponse toResponse(WorkoutLog log) {
        return WorkoutLogResponse.builder()
                .id(log.getId())
                .date(log.getDate())
                .createdAt(log.getCreatedAt())
                .userId(log.getUser().getId())
                .userName(log.getUser().getName())
                .build();
    }

    // Get log for a specific date
    public WorkoutLogResponse getLogByDate(LocalDate date) {
        User user = getCurrentUser();
        WorkoutLog log = workoutLogRepository.findByUserIdAndDate(user.getId(), date)
                .orElseThrow(() -> new RuntimeException(
                        "No workout log found for date: " + date));
        return toResponse(log);
    }

    // Get all logs for current user
    public List<WorkoutLogResponse> getAllLogs() {
        User user = getCurrentUser();
        return workoutLogRepository.findAllByUserIdOrderByDateDesc(user.getId())
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // Create a new log for a date
    public WorkoutLogResponse createLog(LocalDate date) {
        User user = getCurrentUser();

        if (workoutLogRepository.existsByUserIdAndDate(user.getId(), date)) {
            throw new RuntimeException(
                    "Workout log already exists for date: " + date);
        }

        WorkoutLog log = WorkoutLog.builder()
                .user(user)
                .date(date)
                .build();

        return toResponse(workoutLogRepository.save(log));
    }

    // Delete a log by id
    public void deleteLog(UUID id) {
        User user = getCurrentUser();
        WorkoutLog log = workoutLogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Workout log not found"));

        if (!log.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You are not authorized to delete this log");
        }

        workoutLogRepository.deleteById(id);
    }
}