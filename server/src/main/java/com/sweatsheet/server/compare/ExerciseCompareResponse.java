package com.sweatsheet.server.compare;

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
public class ExerciseCompareResponse {

    private UUID planExerciseId;
    private String name;
    private List<SetCompareResponse> sets;
}