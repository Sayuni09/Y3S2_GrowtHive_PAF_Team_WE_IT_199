package com.growthive.backend.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "profiles")
public class Profile {
    @Id
    private String id;
    private String userId;
    private String name;
    private String email;
    private String bio;
    private String location;
    private String website;
    private String profilePicture;
    private String coverImage;
    private Date joinedDate;
    private Integer followers;
    private Integer following;
    
    // Activity summary data
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ActivitySummary {
        private Integer postsCreated;
        private Integer postsLiked;
        private Integer commentsReceived;
        private Integer designChallenges;
    }
    
    private ActivitySummary activitySummary;
}
