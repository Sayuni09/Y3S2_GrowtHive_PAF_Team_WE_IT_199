package com.growthive.backend.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import java.io.IOException;
import java.net.URI;
import java.nio.file.Path;

@Service
public class AIImageGenerationService {
    private static final Logger logger = LoggerFactory.getLogger(AIImageGenerationService.class);
    
    public String generateRoomRedesign(String originalImagePath, String designStylePrompt) {
        try {
            logger.info("Generating room redesign with style: {}", designStylePrompt);
            
            // Create prompt for the room redesign
            String prompt = "Transform this interior room into a " + designStylePrompt + 
                    " style. Keep the room's original layout and structure, but change the decoration, " +
                    "furniture, color scheme, and accessories to match the " + designStylePrompt + " style.";
            
            // Encode the prompt for URL
            String encodedPrompt = java.net.URLEncoder.encode(prompt, java.nio.charset.StandardCharsets.UTF_8);
            
            // Use Pollinations.ai as a completely free service
            String imageUrl = "https://image.pollinations.ai/prompt/" + encodedPrompt;
            
            logger.info("Generated image URL: {}", imageUrl);
            return imageUrl;
            
        } catch (Exception e) {
            logger.error("Error generating room redesign", e);
            throw new RuntimeException("Failed to generate room redesign: " + e.getMessage(), e);
        }
    }
    
    public String downloadImageFromUrl(String imageUrl, Path targetPath) throws IOException {
        try {
            URI uri = URI.create(imageUrl);
            try (var in = uri.toURL().openStream()) {
                java.nio.file.Files.copy(in, targetPath, java.nio.file.StandardCopyOption.REPLACE_EXISTING);
            }
            return targetPath.getFileName().toString();
        } catch (IOException e) {
            logger.error("Error downloading image from URL", e);
            throw e;
        }
    }
}
