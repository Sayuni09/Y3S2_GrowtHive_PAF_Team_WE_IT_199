package com.growthive.backend.controller;

import com.growthive.backend.model.LearningPlan;
import com.growthive.backend.service.LearningPlanService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/learning-plans")
@CrossOrigin(origins = "*")
public class LearningPlanController {
    private static final Logger logger = LoggerFactory.getLogger(LearningPlanController.class);

    @Autowired
    private LearningPlanService learningPlanService;

    @GetMapping
    public List<LearningPlan> getAllLearningPlans() {
        logger.info("Getting all learning plans");
        return learningPlanService.getAllLearningPlans();
    }

    @GetMapping("/user/{userId}")
    public List<LearningPlan> getLearningPlansByUserId(@PathVariable String userId) {
        logger.info("Getting learning plans for user: {}", userId);
        List<LearningPlan> plans = learningPlanService.getLearningPlansByUserId(userId);
        logger.info("Found {} learning plans for user {}", plans.size(), userId);
        return plans;
    }

    @GetMapping("/user/{userId}/status/{status}")
    public List<LearningPlan> getLearningPlansByUserIdAndStatus(
            @PathVariable String userId,
            @PathVariable String status) {
        logger.info("Getting learning plans for user {} with status {}", userId, status);
        return learningPlanService.getLearningPlansByUserIdAndStatus(userId, status);
    }

    @GetMapping("/{id}")
    public ResponseEntity<LearningPlan> getLearningPlanById(@PathVariable String id) {
        logger.info("Getting learning plan by id: {}", id);
        LearningPlan learningPlan = learningPlanService.getLearningPlanById(id);
        if (learningPlan != null) {
            return ResponseEntity.ok(learningPlan);
        }
        logger.warn("Learning plan not found for id: {}", id);
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public LearningPlan createLearningPlan(@RequestBody LearningPlan learningPlan) {
        logger.info("Creating new learning plan: {}", learningPlan);
        return learningPlanService.createLearningPlan(learningPlan);
    }

    @PutMapping("/{id}")
    public ResponseEntity<LearningPlan> updateLearningPlan(
            @PathVariable String id,
            @RequestBody LearningPlan learningPlanDetails) {
        logger.info("Updating learning plan {} with data: {}", id, learningPlanDetails);
        LearningPlan updatedLearningPlan = learningPlanService.updateLearningPlan(id, learningPlanDetails);
        if (updatedLearningPlan != null) {
            return ResponseEntity.ok(updatedLearningPlan);
        }
        logger.warn("Learning plan not found for update, id: {}", id);
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteLearningPlan(@PathVariable String id) {
        logger.info("Deleting learning plan: {}", id);
        boolean deleted = learningPlanService.deleteLearningPlan(id);
        if (deleted) {
            return ResponseEntity.ok().build();
        }
        logger.warn("Learning plan not found for deletion, id: {}", id);
        return ResponseEntity.notFound().build();
    }
} 