package com.growthive.backend.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "posts")
public class Post {
    @Id
    private String id;
    private String title;
    private String content;
    
    
    private List<Media> mediaFiles = new ArrayList<>();
    
    private String userId;
    private String userName;
    private String userProfilePic;
    private String category; 
    private String visibility;
    
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime createdAt;
    
    private int likes;
    private int comments;
    
    // Nested Media class to store media information
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Media {
        private String url;
        private String type; // "image" or "video"
        private String originalName;
        private Long size;
        private Integer durationInSeconds; // For videos
    }
}
