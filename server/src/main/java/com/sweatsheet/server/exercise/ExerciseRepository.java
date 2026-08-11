package com.sweatsheet.server.exercise;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ExerciseRepository extends JpaRepository<Exercise, UUID> {

    List<Exercise> findAllByWorkoutLogId(UUID logId);

    void deleteAllByWorkoutLogId(UUID logId);
}