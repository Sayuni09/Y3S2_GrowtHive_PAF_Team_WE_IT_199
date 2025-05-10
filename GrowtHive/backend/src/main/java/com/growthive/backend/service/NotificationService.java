package com.growthive.backend.service;

import com.growthive.backend.model.Notification;
import com.growthive.backend.model.Post;
import com.growthive.backend.model.User;
import com.growthive.backend.repository.NotificationRepository;
import com.growthive.backend.repository.PostRepository;
import com.growthive.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class NotificationService {
    private static final Logger logger = LoggerFactory.getLogger(NotificationService.class);

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final PostRepository postRepository;

    // Create a notification for a comment
    public void createCommentNotification(String postId, String commentorId, String commentId) {
        try {
            // Get post to determine who to notify
            Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
                
            String postOwnerId = post.getUserId();
            
            // Don't create notification if user is commenting on their own post
            if (postOwnerId.equals(commentorId)) {
                return;
            }
            
            // Get commenter user info
            User commenter = userRepository.findById(commentorId)
                .orElseThrow(() -> new RuntimeException("User not found"));
            
            // Create notification
            Notification notification = Notification.builder()
                .type("COMMENT")
                .message(commenter.getName() + " commented on your post")
                .recipientId(postOwnerId)
                .actorId(commentorId)
                .actorName(commenter.getName())
                .postId(postId)
                .isRead(false)
                .createdAt(LocalDateTime.now())
                .build();
                
            notificationRepository.save(notification);
            logger.info("Comment notification created for user ID: {}", postOwnerId);
        } catch (Exception e) {
            logger.error("Error creating comment notification: ", e);
        }
    }
    
    // Create a notification for a like
    public void createLikeNotification(String postId, String likerId) {
        try {
            // Get post to determine who to notify
            Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
                
            String postOwnerId = post.getUserId();
            
            // Don't create notification if user is liking their own post
            if (postOwnerId.equals(likerId)) {
                return;
            }
            
            // Get liker user info
            User liker = userRepository.findById(likerId)
                .orElseThrow(() -> new RuntimeException("User not found"));
            
            // Create notification
            Notification notification = Notification.builder()
                .type("LIKE")
                .message(liker.getName() + " liked your post")
                .recipientId(postOwnerId)
                .actorId(likerId)
                .actorName(liker.getName())
                .postId(postId)
                .isRead(false)
                .createdAt(LocalDateTime.now())
                .build();
                
            notificationRepository.save(notification);
            logger.info("Like notification created for user ID: {}", postOwnerId);
        } catch (Exception e) {
            logger.error("Error creating like notification: ", e);
        }
    }
    
    // Create a notification for a follow
    public void createFollowNotification(String followerId, String followingId) {
        try {
            // Get follower user info
            User follower = userRepository.findById(followerId)
                .orElseThrow(() -> new RuntimeException("User not found"));
            
            // Create notification
            Notification notification = Notification.builder()
                .type("FOLLOW")
                .message(follower.getName() + " started following you")
                .recipientId(followingId)
                .actorId(followerId)
                .actorName(follower.getName())
                .isRead(false)
                .createdAt(LocalDateTime.now())
                .build();
                
            notificationRepository.save(notification);
            logger.info("Follow notification created for user ID: {}", followingId);
        } catch (Exception e) {
            logger.error("Error creating follow notification: ", e);
        }
    }
    
    // Get all notifications for a user
    public List<Notification> getUserNotifications(String userId) {
        logger.info("Fetching all notifications for user ID: {}", userId);
        return notificationRepository.findByRecipientIdOrderByCreatedAtDesc(userId);
    }
    
    // Get unread notifications for a user
    public List<Notification> getUnreadNotifications(String userId) {
        logger.info("Fetching unread notifications for user ID: {}", userId);
        return notificationRepository.findByRecipientIdAndIsReadOrderByCreatedAtDesc(userId, false);
    }
    
    // Count unread notifications for a user
    public long countUnreadNotifications(String userId) {
        return notificationRepository.countByRecipientIdAndIsRead(userId, false);
    }
    
    // Mark a single notification as read
    public Notification markNotificationAsRead(String notificationId, String userId) {
        Notification notification = notificationRepository.findById(notificationId)
            .orElseThrow(() -> new RuntimeException("Notification not found"));
            
        // Ensure the user owns this notification
        if (!notification.getRecipientId().equals(userId)) {
            throw new IllegalArgumentException("You do not have permission to access this notification");
        }
        
        notification.setRead(true);
        return notificationRepository.save(notification);
    }
    
    // Mark all notifications as read for a user
    public void markAllNotificationsAsRead(String userId) {
        logger.info("Marking all notifications as read for user ID: {}", userId);
        List<Notification> unreadNotifications = notificationRepository.findByRecipientIdAndIsReadOrderByCreatedAtDesc(userId, false);
        
        for (Notification notification : unreadNotifications) {
            notification.setRead(true);
            notificationRepository.save(notification);
        }
    }
    
    // Get notification status (count and if there are unread notifications)
    public Map<String, Object> getNotificationStatus(String userId) {
        long unreadCount = countUnreadNotifications(userId);
        
        Map<String, Object> status = new HashMap<>();
        status.put("unreadCount", unreadCount);
        status.put("hasUnread", unreadCount > 0);
        
        return status;
    }
}
