

package com.growthive.backend.service;

import com.growthive.backend.model.DesignStyle;
import com.growthive.backend.model.RoomMakeover;
import com.growthive.backend.repository.RoomMakeoverRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RoomMakeoverService {
    private static final Logger logger = LoggerFactory.getLogger(RoomMakeoverService.class);
    
    private final RoomMakeoverRepository roomMakeoverRepository;
    private final FileStorageService fileStorageService;
    private final AIImageGenerationService aiImageGenerationService;
    
    @Value("${file.upload-dir:./uploads}")
    private String uploadDir;
    
    public RoomMakeover createRoomMakeover(String userId, String originalImageName, DesignStyle designStyle) {
        try {
            logger.info("Creating room makeover for user: {} with style: {}", userId, designStyle);
            
            // Get the full path to the original image
            Resource originalImageResource = fileStorageService.loadFileAsResource(originalImageName);
            String originalImagePath = originalImageResource.getFile().getAbsolutePath();
            
            // Generate redesigned image with AI
            String prompt = designStyle.getPromptDescription();
            String redesignedImageUrl = aiImageGenerationService.generateRoomRedesign(originalImagePath, prompt);
            
            // Download the AI-generated image and save it locally
            String fileExtension = originalImageName.substring(originalImageName.lastIndexOf("."));
            String redesignedImageName = "redesign_" + UUID.randomUUID().toString() + fileExtension;
            Path targetPath = Paths.get(uploadDir, redesignedImageName);
            aiImageGenerationService.downloadImageFromUrl(redesignedImageUrl, targetPath);
            
            // Create and save room makeover record
            RoomMakeover roomMakeover = RoomMakeover.builder()
                    .userId(userId)
                    .originalImageName(originalImageName)
                    .redesignedImageName(redesignedImageName)
                    .designStyle(designStyle)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .isPublic(false)
                    .isPartOfChallenge(false)
                    .build();
            
            return roomMakeoverRepository.save(roomMakeover);
        } catch (Exception e) {
            logger.error("Error creating room makeover", e);
            throw new RuntimeException("Error creating room makeover: " + e.getMessage(), e);
        }
    }
    
    public List<RoomMakeover> getUserMakeovers(String userId) {
        return roomMakeoverRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
    
    public RoomMakeover getMakeover(String id, String userId) {
        return roomMakeoverRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new RuntimeException("Makeover not found"));
    }
    
    public void deleteMakeover(String id, String userId) {
        RoomMakeover makeover = roomMakeoverRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new RuntimeException("Makeover not found"));
        
        // Delete associated files
        fileStorageService.deleteFile(makeover.getOriginalImageName());
        fileStorageService.deleteFile(makeover.getRedesignedImageName());
        
        // Delete record
        roomMakeoverRepository.delete(makeover);
    }
    
    public List<RoomMakeover> getPublicMakeovers() {
        return roomMakeoverRepository.findByIsPublicTrueOrderByCreatedAtDesc();
    }
    
    public void makeMakeoverPublic(String id, String userId, boolean isPublic) {
        RoomMakeover makeover = roomMakeoverRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new RuntimeException("Makeover not found"));
        makeover.setPublic(isPublic);
        roomMakeoverRepository.save(makeover);
    }
}
