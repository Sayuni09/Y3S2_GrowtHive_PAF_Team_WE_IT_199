

package com.growthive.backend.controller;

import com.growthive.backend.model.Comment;
import com.growthive.backend.security.JwtUtils;
import com.growthive.backend.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth/comments")
@CrossOrigin(origins = "http://localhost:3000", maxAge = 3600, allowCredentials = "true")
@RequiredArgsConstructor
public class CommentController {
    private static final Logger logger = LoggerFactory.getLogger(CommentController.class);

    private final CommentService commentService;
    private final JwtUtils jwtUtils;

    // CREATE
    @PostMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> createComment(
            @RequestParam("postId") String postId,
            @RequestParam("content") String content,
            @RequestHeader("Authorization") String authHeader) {
        try {
            // Extract user ID from JWT token
            String token = authHeader.substring(7); // Remove "Bearer " prefix
            String userId = jwtUtils.getUserIdFromJwtToken(token);
            
            logger.info("Creating comment for post ID: {} by user ID: {}", postId, userId);
            
            Comment comment = commentService.createComment(postId, userId, content);
            return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(comment);
        } catch (IllegalArgumentException e) {
            logger.warn("Validation error: {}", e.getMessage());
            return ResponseEntity.badRequest()
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            logger.error("Error creating comment: ", e);
            return ResponseEntity.badRequest()
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of("error", e.getMessage()));
        }
    }

    // READ (Get comments for a post)
    @GetMapping(value = "/post/{postId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Comment>> getCommentsByPostId(@PathVariable String postId) {
        logger.info("Fetching comments for post ID: {}", postId);
        return ResponseEntity.ok()
            .contentType(MediaType.APPLICATION_JSON)
            .body(commentService.getCommentsByPostId(postId));
    }

    // UPDATE
    @PutMapping(value = "/{commentId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> updateComment(
            @PathVariable String commentId,
            @RequestParam("content") String content,
            @RequestHeader("Authorization") String authHeader) {
        try {
            // Extract user ID from JWT token
            String token = authHeader.substring(7); // Remove "Bearer " prefix
            String userId = jwtUtils.getUserIdFromJwtToken(token);
            
            logger.info("Updating comment with ID: {} by user ID: {}", commentId, userId);
            
            Comment updatedComment = commentService.updateComment(commentId, userId, content);
            return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(updatedComment);
        } catch (IllegalArgumentException e) {
            logger.warn("Validation error: {}", e.getMessage());
            return ResponseEntity.badRequest()
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            logger.error("Error updating comment: ", e);
            return ResponseEntity.badRequest()
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of("error", e.getMessage()));
        }
    }

    // DELETE
    @DeleteMapping(value = "/{commentId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> deleteComment(
            @PathVariable String commentId,
            @RequestHeader("Authorization") String authHeader) {
        try {
            // Extract user ID from JWT token
            String token = authHeader.substring(7); // Remove "Bearer " prefix
            String userId = jwtUtils.getUserIdFromJwtToken(token);
            
            logger.info("Deleting comment with ID: {} by user ID: {}", commentId, userId);
            
            commentService.deleteComment(commentId, userId);
            return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of("message", "Comment deleted successfully"));
        } catch (IllegalArgumentException e) {
            logger.warn("Validation error: {}", e.getMessage());
            return ResponseEntity.badRequest()
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            logger.error("Error deleting comment: ", e);
            return ResponseEntity.badRequest()
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of("error", e.getMessage()));
        }
    }
}
