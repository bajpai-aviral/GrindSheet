package com.grindsheet.server.setlog;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface SetLogRepository extends JpaRepository<SetLog, UUID> {

    List<SetLog> findAllByWorkoutLogId(UUID workoutLogId);

    List<SetLog> findAllByPlanExerciseIdAndWorkoutLogId(
            UUID planExerciseId, UUID workoutLogId);

    Optional<SetLog> findByWorkoutLogIdAndPlanExerciseIdAndSetNumber(
            UUID workoutLogId, UUID planExerciseId, int setNumber);

    List<SetLog> findAllByPlanExerciseId(UUID planExerciseId);
}