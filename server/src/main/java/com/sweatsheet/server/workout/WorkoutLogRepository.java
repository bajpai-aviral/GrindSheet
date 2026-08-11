package com.sweatsheet.server.workout;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface WorkoutLogRepository extends JpaRepository<WorkoutLog, UUID> {

    Optional<WorkoutLog> findByUserIdAndDate(UUID userId, LocalDate date);

    List<WorkoutLog> findAllByUserIdOrderByDateDesc(UUID userId);

    boolean existsByUserIdAndDate(UUID userId, LocalDate date);
}