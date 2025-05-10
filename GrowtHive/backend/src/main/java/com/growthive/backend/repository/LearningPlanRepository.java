package com.growthive.backend.repository;

import com.growthive.backend.model.LearningPlan;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
 
public interface LearningPlanRepository extends MongoRepository<LearningPlan, String> {
    List<LearningPlan> findByUserId(String userId);
    List<LearningPlan> findByUserIdAndStatus(String userId, String status);
} 