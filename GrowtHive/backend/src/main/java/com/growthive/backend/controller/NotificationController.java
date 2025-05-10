package com.growthive.backend.controller;

import com.growthive.backend.model.Notification;
import com.growthive.backend.security.JwtUtils;
import com.growthive.backend.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth/notifications")
@CrossOrigin(origins = "http://localhost:3000", maxAge = 3600, allowCredentials = "true")
@RequiredArgsConstructor
public class NotificationController {
    private static final Logger logger = LoggerFactory.getLogger(NotificationController.class);

    private final NotificationService notificationService;
    private final JwtUtils jwtUtils;

    // Get all notifications for current user
    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getUserNotifications(@RequestHeader("Authorization") String authHeader) {
        try {
            // Extract user ID from JWT token
            String token = authHeader.substring(7); // Remove "Bearer " prefix
            String userId = jwtUtils.getUserIdFromJwtToken(token);
            
            logger.info("Fetching notifications for user ID: {}", userId);
            
            List<Notification> notifications = notificationService.getUserNotifications(userId);
            return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(notifications);
        } catch (Exception e) {
            logger.error("Error fetching notifications: ", e);
            return ResponseEntity.badRequest()
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of("error", e.getMessage()));
        }
    }
    
    // Get only unread notifications
    @GetMapping(value = "/unread", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getUnreadNotifications(@RequestHeader("Authorization") String authHeader) {
        try {
            // Extract user ID from JWT token
            String token = authHeader.substring(7); // Remove "Bearer " prefix
            String userId = jwtUtils.getUserIdFromJwtToken(token);
            
            logger.info("Fetching unread notifications for user ID: {}", userId);
            
            List<Notification> notifications = notificationService.getUnreadNotifications(userId);
            return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(notifications);
        } catch (Exception e) {
            logger.error("Error fetching unread notifications: ", e);
            return ResponseEntity.badRequest()
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of("error", e.getMessage()));
        }
    }
    
    // Get notification status (count and if there are unread notifications)
    @GetMapping(value = "/status", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getNotificationStatus(@RequestHeader("Authorization") String authHeader) {
        try {
            // Extract user ID from JWT token
            String token = authHeader.substring(7); // Remove "Bearer " prefix
            String userId = jwtUtils.getUserIdFromJwtToken(token);
            
            logger.info("Getting notification status for user ID: {}", userId);
            
            Map<String, Object> status = notificationService.getNotificationStatus(userId);
            return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(status);
        } catch (Exception e) {
            logger.error("Error getting notification status: ", e);
            return ResponseEntity.badRequest()
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of("error", e.getMessage()));
        }
    }

    // Mark a notification as read
    @PutMapping(value = "/{notificationId}/read", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> markNotificationAsRead(
            @PathVariable String notificationId,
            @RequestHeader("Authorization") String authHeader) {
        try {
            // Extract user ID from JWT token
            String token = authHeader.substring(7); // Remove "Bearer " prefix
            String userId = jwtUtils.getUserIdFromJwtToken(token);
            
            logger.info("Marking notification as read: {} for user ID: {}", notificationId, userId);
            
            Notification notification = notificationService.markNotificationAsRead(notificationId, userId);
            return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(notification);
        } catch (IllegalArgumentException e) {
            logger.warn("Validation error: {}", e.getMessage());
            return ResponseEntity.badRequest()
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            logger.error("Error marking notification as read: ", e);
            return ResponseEntity.badRequest()
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of("error", e.getMessage()));
        }
    }
    
    // Mark all notifications as read
    @PutMapping(value = "/read-all", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> markAllNotificationsAsRead(@RequestHeader("Authorization") String authHeader) {
        try {
            // Extract user ID from JWT token
            String token = authHeader.substring(7); // Remove "Bearer " prefix
            String userId = jwtUtils.getUserIdFromJwtToken(token);
            
            logger.info("Marking all notifications as read for user ID: {}", userId);
            
            notificationService.markAllNotificationsAsRead(userId);
            return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of("message", "All notifications marked as read"));
        } catch (Exception e) {
            logger.error("Error marking all notifications as read: ", e);
            return ResponseEntity.badRequest()
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of("error", e.getMessage()));
        }
    }
}
