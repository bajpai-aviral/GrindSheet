package com.sweatsheet.server.workout;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DailyScreenResponse {

    private UUID workoutLogId;
    private LocalDate date;
    private String dayLabel;
    private String plannerName;
    private List<ExerciseScreenResponse> exercises;
}