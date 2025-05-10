package com.growthive.backend.repository;

import com.growthive.backend.model.Quiz;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface QuizRepository extends MongoRepository<Quiz, String> {
    List<Quiz> findByCreatorId(String creatorId);
    List<Quiz> findBySharedTrue();
} 