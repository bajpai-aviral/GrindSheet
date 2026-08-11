package com.sweatsheet.server.planner;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class PlannerController {

    private final PlannerService plannerService;

    // ── Planner endpoints ──────────────────────────

    // GET /api/planners
    @GetMapping("/api/planners")
    public ResponseEntity<List<PlannerResponse>> getAllPlanners() {
        return ResponseEntity.ok(plannerService.getAllPlanners());
    }

    // GET /api/planners/:id
    @GetMapping("/api/planners/{id}")
    public ResponseEntity<PlannerResponse> getPlanner(@PathVariable UUID id) {
        return ResponseEntity.ok(plannerService.getPlanner(id));
    }

    // POST /api/planners
    @PostMapping("/api/planners")
    public ResponseEntity<PlannerResponse> createPlanner(
            @Valid @RequestBody PlannerRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(plannerService.createPlanner(request));
    }

    // PUT /api/planners/:id
    @PutMapping("/api/planners/{id}")
    public ResponseEntity<PlannerResponse> updatePlanner(
            @PathVariable UUID id,
            @Valid @RequestBody PlannerRequest request) {
        return ResponseEntity.ok(plannerService.updatePlanner(id, request));
    }

    // DELETE /api/planners/:id
    @DeleteMapping("/api/planners/{id}")
    public ResponseEntity<String> deletePlanner(@PathVariable UUID id) {
        plannerService.deletePlanner(id);
        return ResponseEntity.ok("Planner deleted successfully");
    }

    // PUT /api/planners/:id/activate
    @PutMapping("/api/planners/{id}/activate")
    public ResponseEntity<PlannerResponse> activatePlanner(@PathVariable UUID id) {
        return ResponseEntity.ok(plannerService.activatePlanner(id));
    }

    // ── Plan Day endpoints ──────────────────────────

    // POST /api/planners/:id/days
    @PostMapping("/api/planners/{plannerId}/days")
    public ResponseEntity<PlanDayResponse> addDay(
            @PathVariable UUID plannerId,
            @Valid @RequestBody PlanDayRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(plannerService.addDay(plannerId, request));
    }

    // PUT /api/plan-days/:id
    @PutMapping("/api/plan-days/{dayId}")
    public ResponseEntity<PlanDayResponse> updateDay(
            @PathVariable UUID dayId,
            @Valid @RequestBody PlanDayRequest request) {
        return ResponseEntity.ok(plannerService.updateDay(dayId, request));
    }

    // DELETE /api/plan-days/:id
    @DeleteMapping("/api/plan-days/{dayId}")
    public ResponseEntity<String> deleteDay(@PathVariable UUID dayId) {
        plannerService.deleteDay(dayId);
        return ResponseEntity.ok("Day deleted successfully");
    }

    // ── Plan Exercise endpoints ──────────────────────────

    // POST /api/plan-days/:id/exercises
    @PostMapping("/api/plan-days/{dayId}/exercises")
    public ResponseEntity<PlanExerciseResponse> addExercise(
            @PathVariable UUID dayId,
            @Valid @RequestBody PlanExerciseRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(plannerService.addExercise(dayId, request));
    }

    // PUT /api/plan-exercises/:id
    @PutMapping("/api/plan-exercises/{exerciseId}")
    public ResponseEntity<PlanExerciseResponse> updateExercise(
            @PathVariable UUID exerciseId,
            @Valid @RequestBody PlanExerciseRequest request) {
        return ResponseEntity.ok(plannerService.updateExercise(exerciseId, request));
    }

    // DELETE /api/plan-exercises/:id
    @DeleteMapping("/api/plan-exercises/{exerciseId}")
    public ResponseEntity<String> deleteExercise(@PathVariable UUID exerciseId) {
        plannerService.deleteExercise(exerciseId);
        return ResponseEntity.ok("Exercise deleted successfully");
    }
}