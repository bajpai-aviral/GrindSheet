package com.sweatsheet.server.exercise;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/exercises")
@RequiredArgsConstructor
public class ExerciseController {

    private final ExerciseService exerciseService;

    @GetMapping
    public ResponseEntity<List<ExerciseResponse>> getExercisesByLogId(
            @RequestParam UUID logId) {
        return ResponseEntity.ok(exerciseService.getExercisesByLogId(logId));
    }

    @PostMapping
    public ResponseEntity<ExerciseResponse> addExercise(
            @Valid @RequestBody ExerciseRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(exerciseService.addExercise(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ExerciseResponse> updateExercise(
            @PathVariable UUID id,
            @Valid @RequestBody ExerciseRequest request) {
        return ResponseEntity.ok(exerciseService.updateExercise(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteExercise(@PathVariable UUID id) {
        exerciseService.deleteExercise(id);
        return ResponseEntity.ok("Exercise deleted successfully");
    }
}