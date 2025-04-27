package com.growthive.backend.controller;

import com.growthive.backend.model.Post;
import com.growthive.backend.security.JwtUtils;
import com.growthive.backend.service.PostService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth/posts")  //  not Changed from /api/auth/posts to /api/posts
@CrossOrigin(origins = "http://localhost:3000", maxAge = 3600, allowCredentials = "true")
@RequiredArgsConstructor
public class PostController {
    private static final Logger logger = LoggerFactory.getLogger(PostController.class);

    private final PostService postService;
    private final JwtUtils jwtUtils;

    // CREATE
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> createPost(
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestParam(value = "category", required = false) String category,
            @RequestParam(value = "visibility", defaultValue = "public") String visibility,
            @RequestParam(value = "media", required = false) MultipartFile[] mediaFiles,
            @RequestHeader("Authorization") String authHeader) {
        try {
            // Extract user ID from JWT token directly
            String token = authHeader.substring(7); // Remove "Bearer " prefix
            String userId = jwtUtils.getUserIdFromJwtToken(token);
            
            logger.info("Creating post for user ID: {}", userId);
            logger.info("Post details - Title: {}, Content length: {}, Category: {}, Visibility: {}", 
                title, content.length(), category, visibility);
            
            if (mediaFiles != null) {
                logger.info("Received {} media files", mediaFiles.length);
                for (MultipartFile file : mediaFiles) {
                    if (file != null && !file.isEmpty()) {
                        logger.info("Media file: {}, size: {}, type: {}", 
                            file.getOriginalFilename(), file.getSize(), file.getContentType());
                    }
                }
            }
            
            Post post = postService.createPost(userId, title, content, category, visibility, mediaFiles);
            return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(post);
        } catch (IllegalArgumentException e) {
            logger.warn("Validation error: {}", e.getMessage());
            return ResponseEntity.badRequest()
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of("error", e.getMessage()));
        } catch (IOException e) {
            logger.error("File upload error: ", e);
            return ResponseEntity.badRequest()
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of("error", "Failed to create post: " + e.getMessage()));
        } catch (Exception e) {
            logger.error("Error creating post: ", e);
            return ResponseEntity.badRequest()
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of("error", e.getMessage()));
        }
    }

    // READ ALL
    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Post>> getAllPosts() {
        logger.info("Fetching all posts");
        return ResponseEntity.ok()
            .contentType(MediaType.APPLICATION_JSON)
            .body(postService.getAllPosts());
    }

    // READ BY ID
    @GetMapping(value = "/{postId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getPostById(@PathVariable String postId) {
        logger.info("Fetching post with ID: {}", postId);
        try {
            return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(postService.getPostById(postId));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // READ BY USER
    @GetMapping(value = "/user/{userId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Post>> getPostsByUser(@PathVariable String userId) {
        logger.info("Fetching posts for user ID: {}", userId);
        return ResponseEntity.ok()
            .contentType(MediaType.APPLICATION_JSON)
            .body(postService.getPostsByUser(userId));
    }

    // UPDATE
    @PutMapping(value = "/{postId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, 
                produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> updatePost(
            @PathVariable String postId,
            @RequestParam(value = "title", required = false) String title,
            @RequestParam(value = "content", required = false) String content,
            @RequestParam(value = "category", required = false) String category,
            @RequestParam(value = "visibility", required = false) String visibility,
            @RequestParam(value = "media", required = false) MultipartFile[] newMediaFiles,
            @RequestHeader("Authorization") String authHeader) {
        try {
            // Extract user ID from JWT token
            String token = authHeader.substring(7);
            String userId = jwtUtils.getUserIdFromJwtToken(token);
            
            logger.info("Updating post with ID: {} by user ID: {}", postId, userId);
            
            Post updatedPost = postService.updatePost(postId, userId, title, content, 
                                                    category, visibility, newMediaFiles);
            return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(updatedPost);
        } catch (IllegalArgumentException e) {
            logger.warn("Validation error: {}", e.getMessage());
            return ResponseEntity.badRequest()
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of("error", e.getMessage()));
        } catch (IOException e) {
            logger.error("File upload error: ", e);
            return ResponseEntity.badRequest()
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of("error", "Failed to update post: " + e.getMessage()));
        } catch (Exception e) {
            logger.error("Error updating post: ", e);
            return ResponseEntity.badRequest()
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of("error", e.getMessage()));
        }
    }

    // DELETE
    @DeleteMapping(value = "/{postId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> deletePost(
            @PathVariable String postId,
            @RequestHeader("Authorization") String authHeader) {
        try {
            // Extract user ID from JWT token
            String token = authHeader.substring(7);
            String userId = jwtUtils.getUserIdFromJwtToken(token);
            
            logger.info("Deleting post with ID: {} by user ID: {}", postId, userId);
            
            postService.deletePost(postId, userId);
            return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of("message", "Post deleted successfully"));
        } catch (IllegalArgumentException e) {
            logger.warn("Validation error: {}", e.getMessage());
            return ResponseEntity.badRequest()
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            logger.error("Error deleting post: ", e);
            return ResponseEntity.badRequest()
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of("error", e.getMessage()));
        }
    }

    // LIKE POST
    @PostMapping(value = "/{postId}/like", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Post> likePost(@PathVariable String postId) {
        logger.info("Liking post with ID: {}", postId);
        return ResponseEntity.ok()
            .contentType(MediaType.APPLICATION_JSON)
            .body(postService.likePost(postId));
    }
}
