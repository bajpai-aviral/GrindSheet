package com.sweatsheet.server.setlog;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/logs/sets")
@RequiredArgsConstructor
public class SetLogController {

    private final SetLogService setLogService;

    @PostMapping
    public ResponseEntity<SetLogResponse> logSet(
            @Valid @RequestBody SetLogRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(setLogService.logSet(request));
    }

    @GetMapping
    public ResponseEntity<List<SetLogResponse>> getSetLogs(
            @RequestParam UUID workoutLogId) {
        return ResponseEntity.ok(setLogService.getSetLogsByWorkoutLog(workoutLogId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SetLogResponse> updateSetLog(
            @PathVariable UUID id,
            @Valid @RequestBody SetLogRequest request) {
        return ResponseEntity.ok(setLogService.updateSetLog(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteSetLog(@PathVariable UUID id) {
        setLogService.deleteSetLog(id);
        return ResponseEntity.ok("Set log deleted successfully");
    }
}