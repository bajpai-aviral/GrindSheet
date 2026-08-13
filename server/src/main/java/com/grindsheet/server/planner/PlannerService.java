package com.grindsheet.server.planner;

import com.grindsheet.server.setlog.SetLogRepository;
import com.grindsheet.server.user.User;
import com.grindsheet.server.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PlannerService {

    private final PlannerRepository plannerRepository;
    private final PlanDayRepository planDayRepository;
    private final PlanExerciseRepository planExerciseRepository;
    private final UserRepository userRepository;
    private final SetLogRepository setLogRepository;

    // Get currently logged in user
    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // Convert PlanExercise to response
    private PlanExerciseResponse toExerciseResponse(PlanExercise exercise) {
        return PlanExerciseResponse.builder()
                .id(exercise.getId())
                .name(exercise.getName())
                .sets(exercise.getSets())
                .reps(exercise.getReps())
                .exerciseOrder(exercise.getExerciseOrder())
                .build();
    }

    // Convert PlanDay to response
    private PlanDayResponse toDayResponse(PlanDay day) {
        List<PlanExerciseResponse> exercises = planExerciseRepository
                .findAllByPlanDayIdOrderByExerciseOrderAsc(day.getId())
                .stream()
                .map(this::toExerciseResponse)
                .collect(Collectors.toList());

        return PlanDayResponse.builder()
                .id(day.getId())
                .dayOfWeek(day.getDayOfWeek())
                .label(day.getLabel())
                .exercises(exercises)
                .build();
    }

    // Convert Planner to response
    private PlannerResponse toPlannerResponse(Planner planner) {
        List<PlanDayResponse> days = planDayRepository
                .findAllByPlannerId(planner.getId())
                .stream()
                .map(this::toDayResponse)
                .collect(Collectors.toList());

        return PlannerResponse.builder()
                .id(planner.getId())
                .name(planner.getName())
                .isActive(planner.isActive())
                .createdAt(planner.getCreatedAt())
                .days(days)
                .build();
    }

    // Get all planners for current user
    public List<PlannerResponse> getAllPlanners() {
        User user = getCurrentUser();
        return plannerRepository.findAllByUserId(user.getId())
                .stream()
                .map(this::toPlannerResponse)
                .collect(Collectors.toList());
    }

    // Get single planner
    public PlannerResponse getPlanner(UUID id) {
        User user = getCurrentUser();
        Planner planner = plannerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Planner not found"));

        if (!planner.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You are not authorized to view this planner");
        }

        return toPlannerResponse(planner);
    }

    // Create new planner
    public PlannerResponse createPlanner(PlannerRequest request) {
        User user = getCurrentUser();

        Planner planner = Planner.builder()
                .user(user)
                .name(request.getName())
                .isActive(false)
                .build();

        return toPlannerResponse(plannerRepository.save(planner));
    }

    // Rename planner
    public PlannerResponse updatePlanner(UUID id, PlannerRequest request) {
        User user = getCurrentUser();
        Planner planner = plannerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Planner not found"));

        if (!planner.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You are not authorized to edit this planner");
        }

        planner.setName(request.getName());
        return toPlannerResponse(plannerRepository.save(planner));
    }

    public void deletePlanner(UUID id) {
        User user = getCurrentUser();
        Planner planner = plannerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Planner not found"));

        if (!planner.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You are not authorized to delete this planner");
        }

        // Delete all set logs for all exercises in all days
        planDayRepository.findAllByPlannerId(id).forEach(day -> {
            planExerciseRepository
                    .findAllByPlanDayIdOrderByExerciseOrderAsc(day.getId())
                    .forEach(exercise -> {
                        setLogRepository.deleteAll(
                                setLogRepository.findAllByPlanExerciseId(exercise.getId()));
                    });
        });

        plannerRepository.deleteById(id);
    }

    // Activate a planner
    @Transactional
    public PlannerResponse activatePlanner(UUID id) {
        User user = getCurrentUser();
        Planner planner = plannerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Planner not found"));

        if (!planner.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You are not authorized to activate this planner");
        }

        // Deactivate all planners for this user first
        plannerRepository.findAllByUserId(user.getId())
                .forEach(p -> {
                    p.setActive(false);
                    plannerRepository.save(p);
                });

        // Activate selected planner
        planner.setActive(true);
        return toPlannerResponse(plannerRepository.save(planner));
    }

    // Add day to planner
    public PlanDayResponse addDay(UUID plannerId, PlanDayRequest request) {
        User user = getCurrentUser();
        Planner planner = plannerRepository.findById(plannerId)
                .orElseThrow(() -> new RuntimeException("Planner not found"));

        if (!planner.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You are not authorized to edit this planner");
        }

        // Check if day already exists
        if (planDayRepository.findByPlannerIdAndDayOfWeek(
                plannerId, request.getDayOfWeek()).isPresent()) {
            throw new RuntimeException(
                    request.getDayOfWeek() + " already exists in this planner");
        }

        PlanDay day = PlanDay.builder()
                .planner(planner)
                .dayOfWeek(request.getDayOfWeek())
                .label(request.getLabel())
                .build();

        return toDayResponse(planDayRepository.save(day));
    }

    // Edit day label
    public PlanDayResponse updateDay(UUID dayId, PlanDayRequest request) {
        PlanDay day = planDayRepository.findById(dayId)
                .orElseThrow(() -> new RuntimeException("Plan day not found"));

        day.setLabel(request.getLabel());
        return toDayResponse(planDayRepository.save(day));
    }

    // Delete day
    public void deleteDay(UUID dayId) {
        PlanDay day = planDayRepository.findById(dayId)
                .orElseThrow(() -> new RuntimeException("Plan day not found"));

        // Delete set logs for all exercises in this day first
        List<PlanExercise> exercises = planExerciseRepository
                .findAllByPlanDayIdOrderByExerciseOrderAsc(dayId);

        exercises.forEach(exercise -> {
            List<com.grindsheet.server.setlog.SetLog> setLogs = setLogRepository
                    .findAllByPlanExerciseId(exercise.getId());
            setLogRepository.deleteAll(setLogs);
        });

        planDayRepository.deleteById(dayId);
    }

    // Add exercise to a day
    public PlanExerciseResponse addExercise(UUID dayId, PlanExerciseRequest request) {
        PlanDay day = planDayRepository.findById(dayId)
                .orElseThrow(() -> new RuntimeException("Plan day not found"));

        PlanExercise exercise = PlanExercise.builder()
                .planDay(day)
                .name(request.getName())
                .sets(request.getSets())
                .reps(request.getReps())
                .exerciseOrder(request.getExerciseOrder())
                .build();

        return toExerciseResponse(planExerciseRepository.save(exercise));
    }

    // Edit exercise
    public PlanExerciseResponse updateExercise(UUID exerciseId,
            PlanExerciseRequest request) {
        PlanExercise exercise = planExerciseRepository.findById(exerciseId)
                .orElseThrow(() -> new RuntimeException("Exercise not found"));

        exercise.setName(request.getName());
        exercise.setSets(request.getSets());
        exercise.setReps(request.getReps());
        exercise.setExerciseOrder(request.getExerciseOrder());

        return toExerciseResponse(planExerciseRepository.save(exercise));
    }

    public void deleteExercise(UUID exerciseId) {
        PlanExercise exercise = planExerciseRepository.findById(exerciseId)
                .orElseThrow(() -> new RuntimeException("Exercise not found"));

        // Delete set logs first
        List<com.grindsheet.server.setlog.SetLog> setLogs = setLogRepository.findAllByPlanExerciseId(exerciseId);
        setLogRepository.deleteAll(setLogs);

        planExerciseRepository.deleteById(exerciseId);
    }
}