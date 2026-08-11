package com.sweatsheet.server.exercise;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExerciseRequest {

    private UUID logId;

    @NotBlank(message = "Exercise name is required")
    private String name;

    @Min(value = 1, message = "Sets must be at least 1")
    private int sets;

    @Min(value = 1, message = "Reps must be at least 1")
    private int reps;

    @Min(value = 0, message = "Weight cannot be negative")
    private double weight;

    private String notes;
}