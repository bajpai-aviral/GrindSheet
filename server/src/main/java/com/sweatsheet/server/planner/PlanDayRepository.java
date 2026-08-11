package com.sweatsheet.server.planner;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PlanDayRepository extends JpaRepository<PlanDay, UUID> {

    List<PlanDay> findAllByPlannerId(UUID plannerId);

    Optional<PlanDay> findByPlannerIdAndDayOfWeek(UUID plannerId, DayOfWeek dayOfWeek);
}