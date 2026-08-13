package com.grindsheet.server.setlog;

import com.grindsheet.server.planner.PlanExercise;
import com.grindsheet.server.workout.WorkoutLog;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Table(name = "set_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SetLog {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workout_log_id", nullable = false)
    private WorkoutLog workoutLog;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plan_exercise_id", nullable = false)
    private PlanExercise planExercise;

    @Column(name = "set_number", nullable = false)
    private int setNumber;

    @Min(value = 0, message = "Weight cannot be negative")
    @Column(name = "weight_used", nullable = false)
    private double weightUsed;

    private String notes;
}