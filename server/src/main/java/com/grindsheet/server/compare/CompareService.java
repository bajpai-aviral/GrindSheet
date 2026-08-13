package com.grindsheet.server.compare;

import com.grindsheet.server.planner.*;
import com.grindsheet.server.setlog.SetLog;
import com.grindsheet.server.setlog.SetLogRepository;
import com.grindsheet.server.user.User;
import com.grindsheet.server.user.UserRepository;
import com.grindsheet.server.workout.WorkoutLog;
import com.grindsheet.server.workout.WorkoutLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CompareService {

    private final WorkoutLogRepository workoutLogRepository;
    private final SetLogRepository setLogRepository;
    private final PlannerRepository plannerRepository;
    private final PlanDayRepository planDayRepository;
    private final PlanExerciseRepository planExerciseRepository;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public CompareResponse compare(LocalDate date) {
        User user = getCurrentUser();

        Planner planner = plannerRepository
                .findByUserIdAndIsActiveTrue(user.getId())
                .orElseThrow(() -> new RuntimeException(
                        "No active planner found. Please activate a planner first."));

        DayOfWeek dayOfWeek = DayOfWeek.valueOf(
                date.getDayOfWeek().name());

        PlanDay planDay = planDayRepository
                .findByPlannerIdAndDayOfWeek(planner.getId(), dayOfWeek)
                .orElseThrow(() -> new RuntimeException(
                        "No plan found for " + dayOfWeek));

        List<PlanExercise> planExercises = planExerciseRepository
                .findAllByPlanDayIdOrderByExerciseOrderAsc(planDay.getId());

        Optional<WorkoutLog> currentLog = workoutLogRepository
                .findByUserIdAndDate(user.getId(), date);

        Optional<WorkoutLog> previousLog = Optional.empty();
        int weeksBack = 0;
        LocalDate comparedToDate = null;

        for (int i = 1; i <= 3; i++) {
            LocalDate lookBackDate = date.minusWeeks(i);
            previousLog = workoutLogRepository
                    .findByUserIdAndDate(user.getId(), lookBackDate);
            if (previousLog.isPresent()) {
                weeksBack = i;
                comparedToDate = lookBackDate;
                break;
            }
        }

        List<ExerciseCompareResponse> exerciseComparisons = new ArrayList<>();

        for (PlanExercise planExercise : planExercises) {

            List<SetCompareResponse> setComparisons = new ArrayList<>();

            for (int setNum = 1; setNum <= planExercise.getSets(); setNum++) {

                Double currentWeight = null;
                if (currentLog.isPresent()) {
                    Optional<SetLog> currentSetLog = setLogRepository
                            .findByWorkoutLogIdAndPlanExerciseIdAndSetNumber(
                                    currentLog.get().getId(),
                                    planExercise.getId(),
                                    setNum);
                    if (currentSetLog.isPresent()) {
                        currentWeight = currentSetLog.get().getWeightUsed();
                    }
                }

                Double previousWeight = null;
                String message = null;

                if (previousLog.isPresent()) {
                    Optional<SetLog> previousSetLog = setLogRepository
                            .findByWorkoutLogIdAndPlanExerciseIdAndSetNumber(
                                    previousLog.get().getId(),
                                    planExercise.getId(),
                                    setNum);
                    if (previousSetLog.isPresent()) {
                        previousWeight = previousSetLog.get().getWeightUsed();
                    } else {
                        message = "No record found for this set in previous log";
                    }
                } else {
                    message = "No record found up to 3 weeks — check Past Records";
                }

                Double weightDifference = null;
                if (currentWeight != null && previousWeight != null) {
                    weightDifference = currentWeight - previousWeight;
                }

                setComparisons.add(SetCompareResponse.builder()
                        .setNumber(setNum)
                        .reps(planExercise.getReps())
                        .currentWeight(currentWeight)
                        .previousWeight(previousWeight)
                        .weightDifference(weightDifference)
                        .message(message)
                        .build());
            }

            exerciseComparisons.add(ExerciseCompareResponse.builder()
                    .planExerciseId(planExercise.getId())
                    .name(planExercise.getName())
                    .sets(setComparisons)
                    .build());
        }

        return CompareResponse.builder()
                .currentDate(date)
                .comparedToDate(comparedToDate)
                .weeksBack(weeksBack)
                .plannerName(planner.getName())
                .dayLabel(planDay.getLabel())
                .exercises(exerciseComparisons)
                .build();
    }
}