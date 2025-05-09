package com.growthive.backend.controller;

import com.growthive.backend.model.User;
import com.growthive.backend.security.UserDetailsImpl;
import com.growthive.backend.service.FollowService;
import com.growthive.backend.service.UserServiceExtension;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth/users")
@CrossOrigin(origins = "http://localhost:3000", maxAge = 3600, allowCredentials = "true")
public class UserSearchController {
    private static final Logger logger = LoggerFactory.getLogger(UserSearchController.class);
    
    @Autowired
    private UserServiceExtension userServiceExtension;
    
    @Autowired
    private FollowService followService;
    
    @GetMapping("/search")
    public ResponseEntity<?> searchUsers(
            @RequestParam String query,
            @AuthenticationPrincipal UserDetailsImpl currentUser) {
        logger.info("Search request received with query: '{}', from user: {}", 
                query, currentUser.getUsername());
        
        try {
            List<User> users = userServiceExtension.searchUsers(query);
            String currentUserId = currentUser.getId();
            
            List<Map<String, Object>> usersWithFollowStatus = users.stream()
                .filter(user -> !user.getId().equals(currentUserId)) // Filter out current user
                .map(user -> {
                    boolean isFollowing = followService.isFollowing(currentUserId, user.getId());
                    Map<String, Object> userMap = new HashMap<>();
                    userMap.put("id", user.getId());
                    userMap.put("name", user.getName());
                    userMap.put("email", user.getEmail());
                    userMap.put("isFollowing", isFollowing);
                    return userMap;
                })
                .collect(Collectors.toList());
            
            logger.info("Returning {} search results for query: '{}'", 
                    usersWithFollowStatus.size(), query);
            return ResponseEntity.ok(usersWithFollowStatus);
        } catch (Exception e) {
            logger.error("Error processing search request", e);
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Failed to search users: " + e.getMessage()));
        }
    }
    
    @GetMapping("/{userId}")
    public ResponseEntity<?> getUserProfile(
            @PathVariable String userId,
            @AuthenticationPrincipal UserDetailsImpl currentUser) {
        logger.info("Profile request for user: {} by user: {}", userId, currentUser.getUsername());
        
        try {
            User user = userServiceExtension.getUserById(userId);
            boolean isFollowing = followService.isFollowing(currentUser.getId(), userId);
            
            Map<String, Object> userMap = new HashMap<>();
            userMap.put("id", user.getId());
            userMap.put("name", user.getName());
            userMap.put("email", user.getEmail());
            userMap.put("isFollowing", isFollowing);
            
            return ResponseEntity.ok(userMap);
        } catch (Exception e) {
            logger.error("Error retrieving user profile", e);
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Failed to get user profile: " + e.getMessage()));
        }
    }
}
