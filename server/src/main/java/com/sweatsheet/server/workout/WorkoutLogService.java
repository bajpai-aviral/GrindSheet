package com.sweatsheet.server.workout;

import com.sweatsheet.server.planner.DayOfWeek;
import com.sweatsheet.server.planner.PlanDay;
import com.sweatsheet.server.planner.PlanDayRepository;
import com.sweatsheet.server.planner.PlanExercise;
import com.sweatsheet.server.planner.PlanExerciseRepository;
import com.sweatsheet.server.planner.Planner;
import com.sweatsheet.server.planner.PlannerRepository;
import com.sweatsheet.server.setlog.SetLog;
import com.sweatsheet.server.setlog.SetLogRepository;
import com.sweatsheet.server.user.User;
import com.sweatsheet.server.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import java.util.Optional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WorkoutLogService {

    private final WorkoutLogRepository workoutLogRepository;
    private final UserRepository userRepository;
    private final PlannerRepository plannerRepository;
    private final PlanDayRepository planDayRepository;
    private final PlanExerciseRepository planExerciseRepository;
    private final SetLogRepository setLogRepository;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private WorkoutLogResponse toResponse(WorkoutLog log) {
        return WorkoutLogResponse.builder()
                .id(log.getId())
                .date(log.getDate())
                .createdAt(log.getCreatedAt())
                .userId(log.getUser().getId())
                .userName(log.getUser().getName())
                .build();
    }

    public WorkoutLogResponse getLogByDate(LocalDate date) {
        User user = getCurrentUser();
        WorkoutLog log = workoutLogRepository.findByUserIdAndDate(user.getId(), date)
                .orElseThrow(() -> new RuntimeException(
                        "No workout log found for date: " + date));
        return toResponse(log);
    }

    public List<WorkoutLogResponse> getAllLogs() {
        User user = getCurrentUser();
        return workoutLogRepository.findAllByUserIdOrderByDateDesc(user.getId())
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

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

    public void deleteLog(UUID id) {
        User user = getCurrentUser();
        WorkoutLog log = workoutLogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Workout log not found"));

        if (!log.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You are not authorized to delete this log");
        }

        workoutLogRepository.deleteById(id);
    }

    public DailyScreenResponse getTodayScreen(LocalDate date) {
        User user = getCurrentUser();

        Planner planner = plannerRepository
                .findByUserIdAndIsActiveTrue(user.getId())
                .orElseThrow(() -> new RuntimeException(
                        "No active planner found. Please activate a planner first."));

        DayOfWeek dayOfWeek = DayOfWeek.valueOf(date.getDayOfWeek().name());

        PlanDay planDay = planDayRepository
                .findByPlannerIdAndDayOfWeek(planner.getId(), dayOfWeek)
                .orElseThrow(() -> new RuntimeException(
                        "No plan found for " + dayOfWeek));

        List<PlanExercise> planExercises = planExerciseRepository
                .findAllByPlanDayIdOrderByExerciseOrderAsc(planDay.getId());

        WorkoutLog workoutLog = workoutLogRepository
                .findByUserIdAndDate(user.getId(), date)
                .orElseGet(() -> workoutLogRepository.save(
                        WorkoutLog.builder().user(user).date(date).build()));

        List<ExerciseScreenResponse> exerciseScreens = new ArrayList<>();

        for (PlanExercise planExercise : planExercises) {

            List<SetScreenResponse> setScreens = new ArrayList<>();

            for (int setNum = 1; setNum <= planExercise.getSets(); setNum++) {

                Double loggedWeight = setLogRepository
                        .findByWorkoutLogIdAndPlanExerciseIdAndSetNumber(
                                workoutLog.getId(), planExercise.getId(), setNum)
                        .map(SetLog::getWeightUsed)
                        .orElse(null);

                Double previousWeight = null;
                String message = null;

                for (int i = 1; i <= 3; i++) {
                    LocalDate lookBack = date.minusWeeks(i);
                    Optional<WorkoutLog> prevLog = workoutLogRepository
                            .findByUserIdAndDate(user.getId(), lookBack);
                    if (prevLog.isPresent()) {
                        previousWeight = setLogRepository
                                .findByWorkoutLogIdAndPlanExerciseIdAndSetNumber(
                                        prevLog.get().getId(),
                                        planExercise.getId(),
                                        setNum)
                                .map(SetLog::getWeightUsed)
                                .orElse(null);
                        if (previousWeight != null)
                            break;
                    }
                }

                if (previousWeight == null) {
                    message = "No record found up to 3 weeks — check Past Records";
                }

                setScreens.add(SetScreenResponse.builder()
                        .setNumber(setNum)
                        .reps(planExercise.getReps())
                        .previousWeight(previousWeight)
                        .loggedWeight(loggedWeight)
                        .previousWeekMessage(message)
                        .build());
            }

            exerciseScreens.add(ExerciseScreenResponse.builder()
                    .planExerciseId(planExercise.getId())
                    .name(planExercise.getName())
                    .totalSets(planExercise.getSets())
                    .reps(planExercise.getReps())
                    .sets(setScreens)
                    .build());
        }

        return DailyScreenResponse.builder()
                .workoutLogId(workoutLog.getId())
                .date(date)
                .dayLabel(planDay.getLabel())
                .plannerName(planner.getName())
                .exercises(exerciseScreens)
                .build();
    }

    public PastRecordResponse getPastRecord(LocalDate date) {
        User user = getCurrentUser();

        Planner planner = plannerRepository
                .findByUserIdAndIsActiveTrue(user.getId())
                .orElseThrow(() -> new RuntimeException("No active planner found"));

        DayOfWeek dayOfWeek = DayOfWeek.valueOf(date.getDayOfWeek().name());

        PlanDay planDay = planDayRepository
                .findByPlannerIdAndDayOfWeek(planner.getId(), dayOfWeek)
                .orElseThrow(() -> new RuntimeException(
                        "No plan found for " + dayOfWeek));

        List<PlanExercise> planExercises = planExerciseRepository
                .findAllByPlanDayIdOrderByExerciseOrderAsc(planDay.getId());

        WorkoutLog workoutLog = workoutLogRepository
                .findByUserIdAndDate(user.getId(), date)
                .orElseThrow(() -> new RuntimeException(
                        "No workout log found for date: " + date));

        List<ExerciseScreenResponse> exerciseScreens = new ArrayList<>();

        for (PlanExercise planExercise : planExercises) {
            List<SetScreenResponse> setScreens = new ArrayList<>();

            for (int setNum = 1; setNum <= planExercise.getSets(); setNum++) {
                Double loggedWeight = setLogRepository
                        .findByWorkoutLogIdAndPlanExerciseIdAndSetNumber(
                                workoutLog.getId(), planExercise.getId(), setNum)
                        .map(SetLog::getWeightUsed)
                        .orElse(null);

                setScreens.add(SetScreenResponse.builder()
                        .setNumber(setNum)
                        .reps(planExercise.getReps())
                        .loggedWeight(loggedWeight)
                        .previousWeight(null)
                        .previousWeekMessage(null)
                        .build());
            }

            exerciseScreens.add(ExerciseScreenResponse.builder()
                    .planExerciseId(planExercise.getId())
                    .name(planExercise.getName())
                    .totalSets(planExercise.getSets())
                    .reps(planExercise.getReps())
                    .sets(setScreens)
                    .build());
        }

        return PastRecordResponse.builder()
                .workoutLogId(workoutLog.getId())
                .date(date)
                .dayLabel(planDay.getLabel())
                .plannerName(planner.getName())
                .exercises(exerciseScreens)
                .build();
    }
}