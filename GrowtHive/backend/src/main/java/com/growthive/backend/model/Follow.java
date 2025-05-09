package com.growthive.backend.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "follows")
public class Follow {
    @Id
    private String id;
    private String followerId;    // ID of the user who is following
    private String followingId;   // ID of the user being followed
    private LocalDateTime createdAt;
}
