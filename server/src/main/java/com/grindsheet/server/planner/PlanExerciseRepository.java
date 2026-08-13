package com.grindsheet.server.planner;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface PlanExerciseRepository extends JpaRepository<PlanExercise, UUID> {

    List<PlanExercise> findAllByPlanDayIdOrderByExerciseOrderAsc(UUID planDayId);
}