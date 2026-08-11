package com.sweatsheet.server.workout;

import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/logs")
@RequiredArgsConstructor
public class WorkoutLogController {

    private final WorkoutLogService workoutLogService;

    @GetMapping
    public ResponseEntity<WorkoutLogResponse> getLogByDate(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(workoutLogService.getLogByDate(date));
    }

    @GetMapping("/all")
    public ResponseEntity<List<WorkoutLogResponse>> getAllLogs() {
        return ResponseEntity.ok(workoutLogService.getAllLogs());
    }

    @PostMapping
    public ResponseEntity<WorkoutLogResponse> createLog(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(workoutLogService.createLog(date));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteLog(@PathVariable UUID id) {
        workoutLogService.deleteLog(id);
        return ResponseEntity.ok("Workout log deleted successfully");
    }

    @GetMapping("/today")
    public ResponseEntity<DailyScreenResponse> getTodayScreen(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(workoutLogService.getTodayScreen(date));
    }

    @GetMapping("/past")
    public ResponseEntity<PastRecordResponse> getPastRecord(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(workoutLogService.getPastRecord(date));
    }
}