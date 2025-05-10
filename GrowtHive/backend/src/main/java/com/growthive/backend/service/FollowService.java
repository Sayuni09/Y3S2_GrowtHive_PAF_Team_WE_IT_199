package com.growthive.backend.service;

import com.growthive.backend.model.Follow;
import com.growthive.backend.repository.FollowRepository;
import com.growthive.backend.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class FollowService {
    private static final Logger logger = LoggerFactory.getLogger(FollowService.class);
    
    @Autowired
    private FollowRepository followRepository;
    
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private  NotificationService notificationService;
    
    public Follow followUser(String followerId, String followingId) {
        logger.info("User {} attempting to follow user {}", followerId, followingId);
        
        // Check if users exist
        if (!userRepository.existsById(followerId) || !userRepository.existsById(followingId)) {
            logger.error("Follow failed: One or both users do not exist - follower: {}, following: {}", 
                    followerId, followingId);
            throw new RuntimeException("One or both users do not exist");
        }
        
        // Check if already following
        if (followRepository.existsByFollowerIdAndFollowingId(followerId, followingId)) {
            logger.warn("User {} is already following user {}", followerId, followingId);
            throw new RuntimeException("Already following this user");
        }
        
        // Create new follow relationship
        Follow follow = Follow.builder()
                .followerId(followerId)
                .followingId(followingId)
                .createdAt(LocalDateTime.now())
                .build();
        
        Follow savedFollow = followRepository.save(follow);
        logger.info("User {} successfully followed user {}", followerId, followingId);

        // Create notification
notificationService.createFollowNotification(followerId, followingId);

        return savedFollow;
    }
    
    public void unfollowUser(String followerId, String followingId) {
        logger.info("User {} attempting to unfollow user {}", followerId, followingId);
        
        Optional<Follow> follow = followRepository.findByFollowerIdAndFollowingId(followerId, followingId);
        if (follow.isPresent()) {
            followRepository.delete(follow.get());
            logger.info("User {} successfully unfollowed user {}", followerId, followingId);
        } else {
            logger.warn("User {} was not following user {}", followerId, followingId);
            throw new RuntimeException("Not currently following this user");
        }
    }
    
    public boolean isFollowing(String followerId, String followingId) {
        boolean following = followRepository.existsByFollowerIdAndFollowingId(followerId, followingId);
        logger.debug("Check if user {} is following user {}: {}", followerId, followingId, following);
        return following;
    }
    
    public List<Follow> getFollowersList(String userId) {
        return followRepository.findByFollowingId(userId);
    }
    
    public List<Follow> getFollowingList(String userId) {
        return followRepository.findByFollowerId(userId);
    }
}
