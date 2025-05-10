package com.growthive.backend.service;

import com.growthive.backend.model.LearningPlan;
import com.growthive.backend.repository.LearningPlanRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class LearningPlanService {
    private static final Logger logger = LoggerFactory.getLogger(LearningPlanService.class);

    @Autowired
    private LearningPlanRepository learningPlanRepository;

    public List<LearningPlan> getAllLearningPlans() {
        logger.info("Fetching all learning plans from repository");
        return learningPlanRepository.findAll();
    }

    public List<LearningPlan> getLearningPlansByUserId(String userId) {
        logger.info("Fetching learning plans for user ID: {}", userId);
        List<LearningPlan> plans = learningPlanRepository.findByUserId(userId);
        logger.info("Found {} learning plans for user ID: {}", plans.size(), userId);
        return plans;
    }

    public List<LearningPlan> getLearningPlansByUserIdAndStatus(String userId, String status) {
        logger.info("Fetching learning plans for user ID: {} with status: {}", userId, status);
        List<LearningPlan> plans = learningPlanRepository.findByUserIdAndStatus(userId, status);
        logger.info("Found {} learning plans for user ID: {} with status: {}", plans.size(), userId, status);
        return plans;
    }

    public LearningPlan getLearningPlanById(String id) {
        logger.info("Fetching learning plan by ID: {}", id);
        Optional<LearningPlan> learningPlan = learningPlanRepository.findById(id);
        if (learningPlan.isPresent()) {
            logger.info("Found learning plan with ID: {}", id);
            return learningPlan.get();
        }
        logger.warn("No learning plan found with ID: {}", id);
        return null;
    }

    public LearningPlan createLearningPlan(LearningPlan learningPlan) {
        logger.info("Creating new learning plan: {}", learningPlan);
        if (learningPlan.getProgress() == 0) {
            learningPlan.setStatus("in-progress");
        } else if (learningPlan.getProgress() == 100) {
            learningPlan.setStatus("completed");
        }
        learningPlan.setCreatedAt(new Date());
        learningPlan.setUpdatedAt(new Date());
        LearningPlan savedPlan = learningPlanRepository.save(learningPlan);
        logger.info("Successfully created learning plan with ID: {}", savedPlan.getId());
        return savedPlan;
    }

    public LearningPlan updateLearningPlan(String id, LearningPlan learningPlanDetails) {
        logger.info("Updating learning plan with ID: {}", id);
        Optional<LearningPlan> optionalLearningPlan = learningPlanRepository.findById(id);
        if (optionalLearningPlan.isPresent()) {
            LearningPlan learningPlan = optionalLearningPlan.get();
            logger.info("Found existing learning plan: {}", learningPlan);
            
            learningPlan.setTitle(learningPlanDetails.getTitle());
            learningPlan.setDescription(learningPlanDetails.getDescription());
            learningPlan.setProgress(learningPlanDetails.getProgress());
            
            // Update status based on progress
            if (learningPlanDetails.getProgress() == 100) {
                learningPlan.setStatus("completed");
            } else {
                learningPlan.setStatus("in-progress");
            }
            
            learningPlan.setUpdatedAt(new Date());
            LearningPlan updatedPlan = learningPlanRepository.save(learningPlan);
            logger.info("Successfully updated learning plan with ID: {}", id);
            return updatedPlan;
        }
        logger.warn("No learning plan found to update with ID: {}", id);
        return null;
    }

    public boolean deleteLearningPlan(String id) {
        logger.info("Deleting learning plan with ID: {}", id);
        if (learningPlanRepository.existsById(id)) {
            learningPlanRepository.deleteById(id);
            logger.info("Successfully deleted learning plan with ID: {}", id);
            return true;
        }
        logger.warn("No learning plan found to delete with ID: {}", id);
        return false;
    }
} 