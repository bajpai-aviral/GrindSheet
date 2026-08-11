package com.sweatsheet.server.planner;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PlannerRepository extends JpaRepository<Planner, UUID> {

    List<Planner> findAllByUserId(UUID userId);

    Optional<Planner> findByUserIdAndIsActiveTrue(UUID userId);

    boolean existsByUserIdAndIsActiveTrue(UUID userId);
}