package com.growthive.backend.service;

import com.growthive.backend.controller.ProfileController.ProfileUpdateRequest;
import com.growthive.backend.model.Profile;
import com.growthive.backend.model.Profile.ActivitySummary;
import com.growthive.backend.model.User;
import com.growthive.backend.repository.CommentRepository;
import com.growthive.backend.repository.LikeRepository;
import com.growthive.backend.repository.PostRepository;
import com.growthive.backend.repository.ProfileRepository;
import com.growthive.backend.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Date;
import java.util.Optional;
import java.util.UUID;

@Service
public class ProfileService {
    private static final Logger logger = LoggerFactory.getLogger(ProfileService.class);
    
    @Autowired
    private ProfileRepository profileRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PostRepository postRepository;
    
    @Autowired
    private LikeRepository likeRepository;
    
    @Autowired
    private CommentRepository commentRepository;
    
    private final Path uploadPath = Paths.get("uploads/profiles");
    
    public ProfileService() {
        try {
            Files.createDirectories(uploadPath);
        } catch (IOException e) {
            logger.error("Could not create upload directory", e);
        }
    }
    
    public Profile getCurrentUserProfile(String email) {
        if (email == null || email.equals("anonymousUser")) {
            throw new RuntimeException("Valid email required - cannot process anonymousUser");
        }
        
        logger.info("Getting profile for email: {}", email);
        
        // Find profile by email
        Optional<Profile> existingProfile = profileRepository.findByEmail(email);
        
        if (existingProfile.isPresent()) {
            logger.info("Found existing profile for email: {}", email);
            return existingProfile.get();
        }
        
        // If profile doesn't exist, create one from user data
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> {
                logger.error("User not found with email: {}", email);
                return new RuntimeException("User not found with email: " + email);
            });
            
        logger.info("Creating new profile for user: {}", user.getId());
        return createDefaultProfile(user);
    }
    
    public Profile getCurrentUserProfileWithActivitySummary(String email, String userId) {
        Profile profile = getCurrentUserProfile(email);
        
        // Update activity summary with real data
        profile.setActivitySummary(calculateActivitySummary(userId));
        
        // Save the profile with updated activity summary
        return profileRepository.save(profile);
    }
    
    public Profile getProfileByUserId(String userId) {
        return profileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Profile not found for userId: " + userId));
    }
    
    public Profile getProfileByUserIdWithActivitySummary(String userId) {
        Profile profile = getProfileByUserId(userId);
        
        // Update activity summary with real data
        profile.setActivitySummary(calculateActivitySummary(userId));
        
        // Save the profile with updated activity summary
        return profileRepository.save(profile);
    }
    
    public Profile updateProfile(ProfileUpdateRequest request, String email) {
        return updateProfile(request, email, null);
    }
    
    public Profile updateProfile(ProfileUpdateRequest request, String email, String userId) {
        logger.info("Updating profile for email: {}", email);
        
        // Ensure the profile exists
        Profile existingProfile = profileRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Profile not found for email: " + email));
        
        // Update fields provided in the request
        if (request.getName() != null) {
            existingProfile.setName(request.getName());
        }
        if (request.getBio() != null) {
            existingProfile.setBio(request.getBio());
        }
        if (request.getLocation() != null) {
            existingProfile.setLocation(request.getLocation());
        }
        if (request.getWebsite() != null) {
            existingProfile.setWebsite(request.getWebsite());
        }
        if (request.getProfilePicture() != null) {
            existingProfile.setProfilePicture(request.getProfilePicture());
        }
        if (request.getCoverImage() != null) {
            existingProfile.setCoverImage(request.getCoverImage());
        }
        
        // Update activity summary if userId is provided
        if (userId != null) {
            existingProfile.setActivitySummary(calculateActivitySummary(userId));
        }
        
        logger.info("Saving updated profile for email: {}", email);
        return profileRepository.save(existingProfile);
    }
    
    public Profile uploadProfilePicture(MultipartFile file, String email) throws IOException {
        return uploadProfilePicture(file, email, null);
    }
    
    public Profile uploadProfilePicture(MultipartFile file, String email, String userId) throws IOException {
        logger.info("Uploading profile picture for email: {}", email);
        
        Profile profile = profileRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Profile not found for email: " + email));
        
        String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path filePath = uploadPath.resolve(filename);
        Files.copy(file.getInputStream(), filePath);
        
        profile.setProfilePicture("/uploads/profiles/" + filename);
        
        // Update activity summary if userId is provided
        if (userId != null) {
            profile.setActivitySummary(calculateActivitySummary(userId));
        }
        
        return profileRepository.save(profile);
    }
    
    public Profile uploadCoverImage(MultipartFile file, String email) throws IOException {
        return uploadCoverImage(file, email, null);
    }
    
    public Profile uploadCoverImage(MultipartFile file, String email, String userId) throws IOException {
        logger.info("Uploading cover image for email: {}", email);
        
        Profile profile = profileRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Profile not found for email: " + email));
        
        String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path filePath = uploadPath.resolve(filename);
        Files.copy(file.getInputStream(), filePath);
        
        profile.setCoverImage("/uploads/profiles/" + filename);
        
        // Update activity summary if userId is provided
        if (userId != null) {
            profile.setActivitySummary(calculateActivitySummary(userId));
        }
        
        return profileRepository.save(profile);
    }
    
    private ActivitySummary calculateActivitySummary(String userId) {
        logger.info("Calculating activity summary for userId: {}", userId);
        
        try {
            // Count posts created by user
            int postsCreated = postRepository.findByUserId(userId).size();
            
            // Count posts liked by user
            int postsLiked = likeRepository.findByUserId(userId).size();
            
            // Count comments received on user's posts
            int commentsReceived = 0;
            for (var post : postRepository.findByUserId(userId)) {
                commentsReceived += commentRepository.findByPostId(post.getId()).size();
            }
            
            logger.info("Activity summary for userId {}: postsCreated={}, postsLiked={}, commentsReceived={}", 
                userId, postsCreated, postsLiked, commentsReceived);
            
            return ActivitySummary.builder()
                .postsCreated(postsCreated)
                .postsLiked(postsLiked)
                .commentsReceived(commentsReceived)
                .designChallenges(0) // Keep this default value as is
                .build();
                
        } catch (Exception e) {
            logger.error("Error calculating activity summary: {}", e.getMessage());
            
            // Return default values if calculation fails
            return ActivitySummary.builder()
                .postsCreated(0)
                .postsLiked(0)
                .commentsReceived(0)
                .designChallenges(0)
                .build();
        }
    }
    
    private Profile createDefaultProfile(User user) {
        // Create default activity summary
        ActivitySummary activitySummary = ActivitySummary.builder()
                .postsCreated(0)
                .postsLiked(0)
                .commentsReceived(0)
                .designChallenges(0)
                .build();
        
        // Create the profile with default values
        Profile profile = Profile.builder()
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .bio("Interior design enthusiast with a passion for Scandinavian aesthetics and sustainable living solutions.")
                .location("Colombo, Sri Lanka")
                .website("designportfolio.com/emtt")
                .profilePicture("https://randomuser.me/api/portraits/women/44.jpg")
                .coverImage("https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80")
                .joinedDate(new Date())
                .followers(128)
                .following(87)
                .activitySummary(activitySummary)
                .build();
        
        logger.info("Created new default profile for user: {}", user.getId());
        return profileRepository.save(profile);
    }
}
