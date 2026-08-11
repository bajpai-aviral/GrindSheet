package com.sweatsheet.server.exercise;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExerciseResponse {

    private UUID id;
    private UUID logId;
    private String name;
    private int sets;
    private int reps;
    private double weight;
    private String notes;
}