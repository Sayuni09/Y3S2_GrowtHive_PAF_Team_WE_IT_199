
package com.growthive.backend.controller;

import com.growthive.backend.model.DesignStyle;
import com.growthive.backend.model.RoomMakeover;
import com.growthive.backend.security.UserDetailsImpl;
import com.growthive.backend.service.FileStorageService;
import com.growthive.backend.service.RoomMakeoverService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth/room-makeover")
@CrossOrigin(origins = "http://localhost:3000", maxAge = 3600, allowCredentials = "true")
@RequiredArgsConstructor
public class RoomMakeoverController {
    private static final Logger logger = LoggerFactory.getLogger(RoomMakeoverController.class);
    
    private final FileStorageService fileStorageService;
    private final RoomMakeoverService roomMakeoverService;
    
    @PostMapping("/upload")
    public ResponseEntity<?> uploadRoomImage(
            @AuthenticationPrincipal UserDetailsImpl userDetails, 
            @RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Please upload a valid image file"));
            }
            
            String fileName = fileStorageService.storeFile(file);
            String fileDownloadUri = "/api/auth/room-makeover/images/" + fileName;
            
            logger.info("User {} uploaded room image: {}", userDetails.getId(), fileName);
            
            return ResponseEntity.ok(Map.of(
                "fileName", fileName,
                "fileDownloadUri", fileDownloadUri,
                "fileType", file.getContentType(),
                "size", file.getSize()
            ));
        } catch (Exception e) {
            logger.error("Failed to upload room image", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to upload image: " + e.getMessage()));
        }
    }
    
    @PostMapping("/generate")
    public ResponseEntity<?> generateRedesign(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestParam("originalImageName") String originalImageName,
            @RequestParam("designStyle") String designStyleName) {
        try {
            DesignStyle designStyle = DesignStyle.valueOf(designStyleName.toUpperCase());
            RoomMakeover makeover = roomMakeoverService.createRoomMakeover(
                    userDetails.getId(), originalImageName, designStyle);
            
            return ResponseEntity.ok(Map.of(
                "id", makeover.getId(),
                "originalImage", "/api/auth/room-makeover/images/" + makeover.getOriginalImageName(),
                "redesignedImage", "/api/auth/room-makeover/images/" + makeover.getRedesignedImageName(),
                "designStyle", makeover.getDesignStyle().name(),
                "createdAt", makeover.getCreatedAt()
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid design style"));
        } catch (Exception e) {
            logger.error("Failed to generate redesign", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to generate redesign: " + e.getMessage()));
        }
    }
    
    @GetMapping("/images/{fileName:.+}")
    public ResponseEntity<Resource> getImage(@PathVariable String fileName, HttpServletRequest request) {
        try {
            Resource resource = fileStorageService.loadFileAsResource(fileName);
            
            String contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
            if(contentType == null) {
                contentType = "application/octet-stream";
            }
            
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);
        } catch (IOException e) {
            logger.error("Failed to retrieve image", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
    
    @GetMapping("/my-makeovers")
    public ResponseEntity<List<RoomMakeover>> getUserMakeovers(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        List<RoomMakeover> makeovers = roomMakeoverService.getUserMakeovers(userDetails.getId());
        return ResponseEntity.ok(makeovers);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getMakeover(
            @AuthenticationPrincipal UserDetailsImpl userDetails, 
            @PathVariable String id) {
        try {
            RoomMakeover makeover = roomMakeoverService.getMakeover(id, userDetails.getId());
            return ResponseEntity.ok(makeover);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Makeover not found: " + e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMakeover(
            @AuthenticationPrincipal UserDetailsImpl userDetails, 
            @PathVariable String id) {
        try {
            roomMakeoverService.deleteMakeover(id, userDetails.getId());
            return ResponseEntity.ok(Map.of("message", "Makeover deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Failed to delete makeover: " + e.getMessage()));
        }
    }
}
