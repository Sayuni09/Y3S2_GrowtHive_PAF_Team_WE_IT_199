package com.growthive.backend.service;

import com.growthive.backend.model.Post;
import com.growthive.backend.model.User;
import com.growthive.backend.repository.PostRepository;
import com.growthive.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.apache.tika.Tika;
import org.jcodec.api.FrameGrab;
import org.jcodec.common.io.NIOUtils;
import org.jcodec.scale.AWTUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PostService {
    private static final Logger logger = LoggerFactory.getLogger(PostService.class);
    private static final int MAX_FILES_PER_POST = 3;
    private static final int MAX_VIDEO_DURATION_SECONDS = 30;

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final Tika tika = new Tika();
    
    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    public Post createPost(String userId, String title, String content, String category, 
                          String visibility, MultipartFile[] mediaFiles) throws IOException {
        // Get user details
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        logger.info("Creating post for user: {}", user.getEmail());
        
        // Validate number of files
        if (mediaFiles != null && mediaFiles.length > MAX_FILES_PER_POST) {
            throw new IllegalArgumentException("Maximum " + MAX_FILES_PER_POST + " files allowed per post");
        }
        
        List<Post.Media> processedMediaFiles = new ArrayList<>();
        
        // Process each media file
        if (mediaFiles != null && mediaFiles.length > 0) {
            // Create upload directory if it doesn't exist
            File directory = new File(uploadDir);
            if (!directory.exists()) {
                directory.mkdirs();
            }
            
            for (MultipartFile file : mediaFiles) {
                if (file != null && !file.isEmpty()) {
                    // Generate unique filename
                    String originalFilename = file.getOriginalFilename();
                    String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
                    String filename = UUID.randomUUID().toString() + extension;
                    
                    // Save file
                    Path filePath = Paths.get(uploadDir, filename);
                    Files.write(filePath, file.getBytes());
                    
                    // Determine media type
                    String mediaType;
                    Integer duration = null;
                    String contentType = tika.detect(file.getInputStream());
                    
                    if (contentType.startsWith("image/")) {
                        mediaType = "image";
                    } else if (contentType.startsWith("video/")) {
                        mediaType = "video";
                        
                        // Check video duration
                        File videoFile = filePath.toFile();
                        duration = getVideoDurationInSeconds(videoFile);
                        
                        if (duration > MAX_VIDEO_DURATION_SECONDS) {
                            // Delete the file as it exceeds max duration
                            Files.deleteIfExists(filePath);
                            throw new IllegalArgumentException("Video duration must not exceed " + 
                                                              MAX_VIDEO_DURATION_SECONDS + " seconds");
                        }
                    } else {
                        // Unsupported media type, delete the file
                        Files.deleteIfExists(filePath);
                        throw new IllegalArgumentException("Unsupported media type: " + contentType);
                    }
                    
                    // Create Media object
                    Post.Media media = Post.Media.builder()
                            .url("/api/uploads/" + filename)
                            .type(mediaType)
                            .originalName(originalFilename)
                            .size(file.getSize())
                            .durationInSeconds(duration)
                            .build();
                    
                    processedMediaFiles.add(media);
                    logger.info("Media file saved: {}, type: {}", media.getUrl(), media.getType());
                }
            }
        }
        
        // Create post
        Post post = Post.builder()
                .title(title)
                .content(content)
                .category(category)
                .visibility(visibility)
                .mediaFiles(processedMediaFiles)
                .userId(userId)
                .userName(user.getName())
                .userProfilePic("https://randomuser.me/api/portraits/men/1.jpg")
                .createdAt(LocalDateTime.now())
                .likes(0)
                .comments(0)
                .build();
        
        Post savedPost = postRepository.save(post);
        logger.info("Post created successfully with ID: {}", savedPost.getId());
        
        return savedPost;
    }
    
    // Method to get video duration in seconds
    private Integer getVideoDurationInSeconds(File videoFile) throws IOException {
        try {
            // Use mp4parser library for more reliable duration extraction
            org.mp4parser.IsoFile isoFile = new org.mp4parser.IsoFile(videoFile);
            double lengthInSeconds = (double) isoFile.getMovieBox().getMovieHeaderBox().getDuration() / 
                                    isoFile.getMovieBox().getMovieHeaderBox().getTimescale();
            isoFile.close();
            
            logger.info("Video duration detected: {} seconds", lengthInSeconds);
            return (int) Math.ceil(lengthInSeconds);
        } catch (Exception e) {
            logger.error("Error determining video duration: {}", e.getMessage());
            // If unable to determine, assume it's valid but log the error
            return 0;
        }
    }

    
    // Existing methods remain unchanged
    public List<Post> getAllPosts() {
        logger.info("Fetching all posts");
        return postRepository.findAllByOrderByCreatedAtDesc();
    }
    
    public List<Post> getPostsByUser(String userId) {
        logger.info("Fetching posts for user ID: {}", userId);
        return postRepository.findByUserId(userId);
    }
    
    public Post likePost(String postId) {
        logger.info("Liking post with ID: {}", postId);
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        post.setLikes(post.getLikes() + 1);
        return postRepository.save(post);
    }
}
