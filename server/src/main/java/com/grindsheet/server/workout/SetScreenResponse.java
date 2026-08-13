package com.grindsheet.server.workout;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SetScreenResponse {

    private int setNumber;
    private int reps;
    private Double previousWeight;
    private Double loggedWeight;
    private String previousWeekMessage;
}