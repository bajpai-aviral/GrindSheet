package com.grindsheet.server.workout;

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
public class ExerciseScreenResponse {

    private UUID planExerciseId;
    private String name;
    private int totalSets;
    private int reps;
    private List<SetScreenResponse> sets;
}