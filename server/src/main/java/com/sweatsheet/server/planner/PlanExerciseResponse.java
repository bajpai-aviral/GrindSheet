package com.sweatsheet.server.planner;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlanExerciseResponse {

    private UUID id;
    private String name;
    private int sets;
    private int reps;
    private int exerciseOrder;
}