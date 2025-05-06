package com.growthive.backend.service;

import com.growthive.backend.model.Comment;
import com.growthive.backend.model.Post;
import com.growthive.backend.model.User;
import com.growthive.backend.repository.CommentRepository;
import com.growthive.backend.repository.PostRepository;
import com.growthive.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentService {
    private static final Logger logger = LoggerFactory.getLogger(CommentService.class);

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    // Create a new comment or reply
    public Comment createComment(String postId, String userId, String content, String parentId) {
        // Validate post exists
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        
        // Validate user exists
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // If parentId is provided, validate parent comment exists
        if (parentId != null && !parentId.isEmpty()) {
            commentRepository.findById(parentId)
                    .orElseThrow(() -> new RuntimeException("Parent comment not found"));
            logger.info("Creating reply for comment ID: {} by user: {}", parentId, user.getEmail());
        } else {
            logger.info("Creating comment for post ID: {} by user: {}", postId, user.getEmail());
        }
        
        // Create comment
        Comment comment = Comment.builder()
                .content(content)
                .postId(postId)
                .userId(userId)
                .userName(user.getName())
                //.userProfilePic(user.getProfilePicture() != null ? user.getProfilePicture() : "https://randomuser.me/api/portraits/men/1.jpg")
                .parentId(parentId) // Set parentId (null for top-level comments)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        
        // Save comment
        Comment savedComment = commentRepository.save(comment);
        
        // Update comment count in post
        post.setComments(post.getComments() + 1);
        postRepository.save(post);
        
        logger.info("Comment created successfully with ID: {}", savedComment.getId());
        
        return savedComment;
    }
    
    // Overload for backward compatibility
    public Comment createComment(String postId, String userId, String content) {
        return createComment(postId, userId, content, null);
    }
    
    // Get all comments for a post
    public List<Comment> getCommentsByPostId(String postId) {
        logger.info("Fetching comments for post ID: {}", postId);
        return commentRepository.findByPostIdOrderByCreatedAtDesc(postId);
    }
    
    // Update a comment
    public Comment updateComment(String commentId, String userId, String content) {
        // Fetch the comment
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        
        // Verify that the user owns the comment
        if (!comment.getUserId().equals(userId)) {
            throw new IllegalArgumentException("You don't have permission to update this comment");
        }
        
        logger.info("Updating comment with ID: {} by user ID: {}", commentId, userId);
        
        // Update comment
        comment.setContent(content);
        comment.setUpdatedAt(LocalDateTime.now());
        
        // Save and return the updated comment
        Comment updatedComment = commentRepository.save(comment);
        logger.info("Comment updated successfully with ID: {}", updatedComment.getId());
        
        return updatedComment;
    }
    
    // Delete a comment
    public void deleteComment(String commentId, String userId) {
        // Fetch the comment
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        
        // Verify that the user owns the comment
        if (!comment.getUserId().equals(userId)) {
            throw new IllegalArgumentException("You don't have permission to delete this comment");
        }
        
        logger.info("Deleting comment with ID: {} by user ID: {}", commentId, userId);
        
        // Delete the comment
        commentRepository.deleteById(commentId);
        
        // Update comment count in post
        Post post = postRepository.findById(comment.getPostId())
                .orElseThrow(() -> new RuntimeException("Post not found"));
        post.setComments(post.getComments() - 1);
        postRepository.save(post);
        
        logger.info("Comment deleted successfully with ID: {}", commentId);
    }
}
