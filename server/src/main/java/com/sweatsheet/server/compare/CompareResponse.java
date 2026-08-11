package com.sweatsheet.server.compare;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompareResponse {

    private LocalDate currentDate;
    private LocalDate comparedToDate;
    private int weeksBack;
    private String plannerName;
    private String dayLabel;
    private List<ExerciseCompareResponse> exercises;
}