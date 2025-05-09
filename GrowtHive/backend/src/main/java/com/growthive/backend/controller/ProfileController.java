package com.growthive.backend.controller;

import com.growthive.backend.model.Profile;
import com.growthive.backend.security.JwtUtils;
import com.growthive.backend.service.ProfileService;
import lombok.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/auth/profile")
@CrossOrigin(origins = "http://localhost:3000", maxAge = 3600, allowCredentials = "true")
public class ProfileController {
    private static final Logger logger = LoggerFactory.getLogger(ProfileController.class);
    
    @Autowired
    private ProfileService profileService;
    
    @Autowired
    private JwtUtils jwtUtils;
    
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUserProfile() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            
            if (authentication == null) {
                logger.error("No authentication found");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "User not authenticated"));
            }
            
            // Get JWT token from request header
            String authHeader = ((jakarta.servlet.http.HttpServletRequest) 
                ((org.springframework.web.context.request.ServletRequestAttributes) 
                org.springframework.web.context.request.RequestContextHolder.getRequestAttributes())
                .getRequest()).getHeader("Authorization");
            
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                // Extract email directly from token
                String email = jwtUtils.getEmailFromJwtToken(token);
                String userId = jwtUtils.getUserIdFromJwtToken(token);
                logger.info("Extracted email from token: {}, userId: {}", email, userId);
                
                if (email != null) {
                    // Get profile with up-to-date activity summary
                    Profile profile = profileService.getCurrentUserProfileWithActivitySummary(email, userId);
                    return ResponseEntity.ok(profile);
                }
            }
            
            // Fallback to authentication name if token extraction fails
            String principal = authentication.getName();
            logger.info("Using principal from authentication: {}", principal);
            
            Profile profile = profileService.getCurrentUserProfile(principal);
            return ResponseEntity.ok(profile);
        } catch (Exception e) {
            logger.error("Error fetching profile", e);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/{userId}")
    public ResponseEntity<?> getProfileByUserId(@PathVariable String userId) {
        try {
            logger.info("Getting profile for userId: {}", userId);
            Profile profile = profileService.getProfileByUserIdWithActivitySummary(userId);
            return ResponseEntity.ok(profile);
        } catch (Exception e) {
            logger.error("Error fetching profile for userId: {}", userId, e);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PutMapping("/update")
    public ResponseEntity<?> updateProfile(@RequestBody ProfileUpdateRequest request) {
        try {
            String authHeader = ((jakarta.servlet.http.HttpServletRequest) 
                ((org.springframework.web.context.request.ServletRequestAttributes) 
                org.springframework.web.context.request.RequestContextHolder.getRequestAttributes())
                .getRequest()).getHeader("Authorization");
            
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                String email = jwtUtils.getEmailFromJwtToken(token);
                String userId = jwtUtils.getUserIdFromJwtToken(token);
                
                if (email != null) {
                    logger.info("Updating profile with data: {} for user: {}", request, email);
                    Profile updatedProfile = profileService.updateProfile(request, email, userId);
                    return ResponseEntity.ok(updatedProfile);
                }
            }
            
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "User not authenticated"));
        } catch (Exception e) {
            logger.error("Error updating profile", e);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PostMapping(value = "/picture", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadProfilePicture(@RequestParam("file") MultipartFile file) {
        try {
            String authHeader = ((jakarta.servlet.http.HttpServletRequest) 
                ((org.springframework.web.context.request.ServletRequestAttributes) 
                org.springframework.web.context.request.RequestContextHolder.getRequestAttributes())
                .getRequest()).getHeader("Authorization");
            
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                String email = jwtUtils.getEmailFromJwtToken(token);
                String userId = jwtUtils.getUserIdFromJwtToken(token);
                
                if (email != null) {
                    logger.info("Uploading profile picture for user: {}", email);
                    Profile profile = profileService.uploadProfilePicture(file, email, userId);
                    return ResponseEntity.ok(profile);
                }
            }
            
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "User not authenticated"));
        } catch (IOException e) {
            logger.error("Error uploading profile picture", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to upload profile picture: " + e.getMessage()));
        }
    }
    
    @PostMapping(value = "/cover", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadCoverImage(@RequestParam("file") MultipartFile file) {
        try {
            String authHeader = ((jakarta.servlet.http.HttpServletRequest) 
                ((org.springframework.web.context.request.ServletRequestAttributes) 
                org.springframework.web.context.request.RequestContextHolder.getRequestAttributes())
                .getRequest()).getHeader("Authorization");
            
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                String email = jwtUtils.getEmailFromJwtToken(token);
                String userId = jwtUtils.getUserIdFromJwtToken(token);
                
                if (email != null) {
                    logger.info("Uploading cover image for user: {}", email);
                    Profile profile = profileService.uploadCoverImage(file, email, userId);
                    return ResponseEntity.ok(profile);
                }
            }
            
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "User not authenticated"));
        } catch (IOException e) {
            logger.error("Error uploading cover image", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to upload cover image: " + e.getMessage()));
        }
    }
    
    @Data
    public static class ProfileUpdateRequest {
        private String name;
        private String bio;
        private String location;
        private String website;
        private String profilePicture;
        private String coverImage;
    }
}

