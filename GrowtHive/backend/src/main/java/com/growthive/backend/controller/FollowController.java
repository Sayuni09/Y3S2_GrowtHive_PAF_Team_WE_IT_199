package com.growthive.backend.controller;

import com.growthive.backend.model.Follow;
import com.growthive.backend.security.UserDetailsImpl;
import com.growthive.backend.service.FollowService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth/follow")
@CrossOrigin(origins = "http://localhost:3000", maxAge = 3600, allowCredentials = "true")
public class FollowController {
    private static final Logger logger = LoggerFactory.getLogger(FollowController.class);
    
    @Autowired
    private FollowService followService;
    
    @PostMapping("/{userId}")
    public ResponseEntity<?> followUser(
            @AuthenticationPrincipal UserDetailsImpl currentUser,
            @PathVariable String userId) {
        logger.info("Follow request: User {} wants to follow {}", currentUser.getId(), userId);
        
        try {
            // Prevent user from following themselves
            if (currentUser.getId().equals(userId)) {
                return ResponseEntity
                    .badRequest()
                    .body(Map.of("error", "You cannot follow yourself"));
            }
            
            Follow follow = followService.followUser(currentUser.getId(), userId);
            Map<String, Object> responseMap = new HashMap<>();
            responseMap.put("message", "Successfully followed user");
            responseMap.put("followId", follow.getId());
            return ResponseEntity.ok(responseMap);
        } catch (Exception e) {
            logger.error("Error in follow operation", e);
            Map<String, Object> errorMap = new HashMap<>();
            errorMap.put("error", e.getMessage());
            return ResponseEntity
                .badRequest()
                .body(errorMap);
        }
    }
    
    @DeleteMapping("/{userId}")
    public ResponseEntity<?> unfollowUser(
            @AuthenticationPrincipal UserDetailsImpl currentUser,
            @PathVariable String userId) {
        logger.info("Unfollow request: User {} wants to unfollow {}", currentUser.getId(), userId);
        
        try {
            followService.unfollowUser(currentUser.getId(), userId);
            return ResponseEntity.ok(Map.of("message", "Successfully unfollowed user"));
        } catch (Exception e) {
            logger.error("Error in unfollow operation", e);
            Map<String, Object> errorMap = new HashMap<>();
            errorMap.put("error", e.getMessage());
            return ResponseEntity
                .badRequest()
                .body(errorMap);
        }
    }
    
    @GetMapping("/status/{userId}")
    public ResponseEntity<?> getFollowStatus(
            @AuthenticationPrincipal UserDetailsImpl currentUser,
            @PathVariable String userId) {
        boolean isFollowing = followService.isFollowing(currentUser.getId(), userId);
        return ResponseEntity.ok(Map.of("following", isFollowing));
    }
}
