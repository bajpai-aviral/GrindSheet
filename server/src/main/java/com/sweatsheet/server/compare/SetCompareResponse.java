package com.sweatsheet.server.compare;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SetCompareResponse {

    private int setNumber;
    private int reps;
    private Double currentWeight;
    private Double previousWeight;
    private Double weightDifference;
    private String message;
}