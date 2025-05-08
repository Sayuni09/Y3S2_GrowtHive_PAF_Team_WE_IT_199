// LikeController.java
package com.growthive.backend.controller;

import com.growthive.backend.security.JwtUtils;
import com.growthive.backend.service.LikeService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth/likes")
@CrossOrigin(origins = "http://localhost:3000", maxAge = 3600, allowCredentials = "true")
@RequiredArgsConstructor
public class LikeController {
    private static final Logger logger = LoggerFactory.getLogger(LikeController.class);

    private final LikeService likeService;
    private final JwtUtils jwtUtils;

    // Toggle like/unlike
    @PostMapping(value = "/toggle", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> toggleLike(
            @RequestParam("postId") String postId,
            @RequestHeader("Authorization") String authHeader) {
        try {
            // Extract user ID from JWT token
            String token = authHeader.substring(7); // Remove "Bearer " prefix
            String userId = jwtUtils.getUserIdFromJwtToken(token);
            
            logger.info("Toggling like for post ID: {} by user ID: {}", postId, userId);
            
            Map<String, Object> result = likeService.toggleLike(postId, userId);
            return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(result);
        } catch (IllegalArgumentException e) {
            logger.warn("Validation error: {}", e.getMessage());
            return ResponseEntity.badRequest()
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            logger.error("Error processing like: ", e);
            return ResponseEntity.badRequest()
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of("error", e.getMessage()));
        }
    }
    
    // Get like status and count for a post
    @GetMapping(value = "/status", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getLikeStatus(
            @RequestParam("postId") String postId,
            @RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.substring(7);
            String userId = jwtUtils.getUserIdFromJwtToken(token);
            
            logger.info("Getting like status for post ID: {} by user ID: {}", postId, userId);
            
            Map<String, Object> result = likeService.getLikeStatus(postId, userId);
            return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(result);
        } catch (Exception e) {
            logger.error("Error getting like status: ", e);
            return ResponseEntity.badRequest()
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of("error", e.getMessage()));
        }
    }




    @GetMapping(value = "/user-liked-posts", produces = MediaType.APPLICATION_JSON_VALUE)
public ResponseEntity<?> getUserLikedPosts(@RequestHeader("Authorization") String authHeader) {
    try {
        // Extract user ID from JWT token
        String token = authHeader.substring(7); // Remove "Bearer " prefix
        String userId = jwtUtils.getUserIdFromJwtToken(token);
        
        logger.info("Fetching liked posts for user ID: {}", userId);
        
        Map<String, Object> result = likeService.getUserLikedPosts(userId);
        return ResponseEntity.ok()
            .contentType(MediaType.APPLICATION_JSON)
            .body(result);
    } catch (IllegalArgumentException e) {
        logger.warn("Validation error: {}", e.getMessage());
        return ResponseEntity.badRequest()
            .contentType(MediaType.APPLICATION_JSON)
            .body(Map.of("error", e.getMessage()));
    } catch (Exception e) {
        logger.error("Error fetching liked posts: ", e);
        return ResponseEntity.badRequest()
            .contentType(MediaType.APPLICATION_JSON)
            .body(Map.of("error", e.getMessage()));
    }
}
}
