// LikeService.java
package com.growthive.backend.service;

import com.growthive.backend.model.Like;
import com.growthive.backend.model.Post;
import com.growthive.backend.model.User;
import com.growthive.backend.repository.LikeRepository;
import com.growthive.backend.repository.PostRepository;
import com.growthive.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LikeService {
    private static final Logger logger = LoggerFactory.getLogger(LikeService.class);

    private final LikeRepository likeRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    /**
     * Toggle like status for a post
     * If user has already liked the post, remove the like
     * If user hasn't liked the post, add a new like
     */
    public Map<String, Object> toggleLike(String postId, String userId) {
        logger.info("Toggling like for post ID: {} by user ID: {}", postId, userId);
        
        // Validate post exists
        Post post = postRepository.findById(postId)
            .orElseThrow(() -> new IllegalArgumentException("Post not found"));
            
        // Find user
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        // Check if user already liked this post
        Optional<Like> existingLike = likeRepository.findByPostIdAndUserId(postId, userId);
        boolean hasLiked;
        
        if (existingLike.isPresent()) {
            // User already liked post, so unlike it
            likeRepository.delete(existingLike.get());
            hasLiked = false;
            logger.info("Removed like from post ID: {} by user ID: {}", postId, userId);
        } else {
            // User hasn't liked post, add new like
            Like newLike = Like.builder()
                .postId(postId)
                .userId(userId)
                .userName(user.getName())
                //.userProfilePic(user.getProfilePicture())
                .createdAt(LocalDateTime.now())
                .build();
                
            likeRepository.save(newLike);
            hasLiked = true;
            logger.info("Added like to post ID: {} by user ID: {}", postId, userId);
        }
        
        // Update post like count
        long likeCount = likeRepository.countByPostId(postId);
        
        // Return result
        Map<String, Object> result = new HashMap<>();
        result.put("liked", hasLiked);
        result.put("likeCount", likeCount);
        
        return result;
    }
    
    /**
     * Get like status and count for a post
     */
    public Map<String, Object> getLikeStatus(String postId, String userId) {
        boolean hasLiked = likeRepository.findByPostIdAndUserId(postId, userId).isPresent();
        long likeCount = likeRepository.countByPostId(postId);
        
        Map<String, Object> result = new HashMap<>();
        result.put("liked", hasLiked);
        result.put("likeCount", likeCount);
        
        return result;
    }

    public Map<String, Object> getUserLikedPosts(String userId) {
        logger.info("Getting posts liked by user ID: {}", userId);
        
        // Find user
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        // Get all likes by the user
        List<Like> userLikes = likeRepository.findByUserId(userId);
        
        // Extract post IDs from likes
        List<String> postIds = userLikes.stream()
            .map(Like::getPostId)
            .collect(Collectors.toList());
        
        // Get the actual posts
        List<Post> likedPosts = new ArrayList<>();
        if (!postIds.isEmpty()) {
            likedPosts = postRepository.findAllById(postIds);
        }
        
        // For each post, ensure it has like information
        List<Map<String, Object>> enrichedPosts = likedPosts.stream().map(post -> {
            Map<String, Object> postData = new HashMap<>();
            postData.put("id", post.getId());
            postData.put("title", post.getTitle());
            postData.put("content", post.getContent());
            postData.put("mediaFiles", post.getMediaFiles());
            postData.put("createdAt", post.getCreatedAt());
            postData.put("userName", post.getUserName());
            postData.put("userProfilePic", post.getUserProfilePic());
            postData.put("userId", post.getUserId());
            postData.put("category", post.getCategory());
            postData.put("liked", true); // These are all liked posts by definition
            postData.put("likeCount", likeRepository.countByPostId(post.getId()));
            
            return postData;
        }).collect(Collectors.toList());
        
        // Return result with posts and count
        Map<String, Object> result = new HashMap<>();
        result.put("likedPosts", enrichedPosts);
        result.put("count", enrichedPosts.size());
        
        return result;
    }
}
