package com.sweatsheet.server.setlog;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SetLogResponse {

    private UUID id;
    private UUID workoutLogId;
    private UUID planExerciseId;
    private String exerciseName;
    private int setNumber;
    private double weightUsed;
    private String notes;
}