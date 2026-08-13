package com.grindsheet.server.setlog;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SetLogRequest {

    @NotNull(message = "Workout log ID is required")
    private UUID workoutLogId;

    @NotNull(message = "Plan exercise ID is required")
    private UUID planExerciseId;

    @Min(value = 1, message = "Set number must be at least 1")
    private int setNumber;

    @Min(value = 0, message = "Weight cannot be negative")
    private double weightUsed;

    private String notes;
}