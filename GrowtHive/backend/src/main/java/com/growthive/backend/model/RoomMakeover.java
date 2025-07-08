

package com.growthive.backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "room_makeovers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoomMakeover {
    @Id
    private String id;
    
    private String userId;
    private String originalImageName;
    private String redesignedImageName;
    private DesignStyle designStyle;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    private boolean isPublic;
    private boolean isPartOfChallenge;
    private String challengeId;
}
