// LikeRepository.java
package com.growthive.backend.repository;

import com.growthive.backend.model.Like;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface LikeRepository extends MongoRepository<Like, String> {
    List<Like> findByPostId(String postId);
    List<Like> findByUserId(String userId);
    Optional<Like> findByPostIdAndUserId(String postId, String userId);
    long countByPostId(String postId);
    void deleteByPostIdAndUserId(String postId, String userId);
}
