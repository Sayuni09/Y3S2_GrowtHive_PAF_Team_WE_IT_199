package com.growthive.backend.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "notifications")
public class Notification {
    @Id
    private String id;
    
    private String type;         // "COMMENT", "LIKE", "FOLLOW"
    private String message;
    private String recipientId;  // User receiving the notification
    private String actorId;      // User who performed the action
    private String actorName;
    private String actorProfilePic;
    private String postId;       // Related post (if applicable)
    private boolean isRead;
    
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime createdAt;
}
