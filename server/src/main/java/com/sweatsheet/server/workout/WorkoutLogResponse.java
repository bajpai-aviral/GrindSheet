package com.sweatsheet.server.workout;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkoutLogResponse {

    private UUID id;
    private LocalDate date;
    private LocalDateTime createdAt;
    private UUID userId;
    private String userName;
}