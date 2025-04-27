
package com.growthive.backend.repository;

import com.growthive.backend.model.Comment;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface CommentRepository extends MongoRepository<Comment, String> {
    List<Comment> findByPostId(String postId);
    List<Comment> findByUserId(String userId);
    List<Comment> findByPostIdOrderByCreatedAtDesc(String postId);
}
