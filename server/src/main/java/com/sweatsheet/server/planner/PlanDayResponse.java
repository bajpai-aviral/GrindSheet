package com.sweatsheet.server.planner;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlanDayResponse {

    private UUID id;
    private DayOfWeek dayOfWeek;
    private String label;
    private List<PlanExerciseResponse> exercises;
}