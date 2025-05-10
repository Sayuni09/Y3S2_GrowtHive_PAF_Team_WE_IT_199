package com.growthive.backend.controller;

import com.growthive.backend.model.Quiz;
import com.growthive.backend.service.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

@RestController
@RequestMapping("/api/quizzes")
@CrossOrigin(origins = "http://localhost:3000")
public class QuizController {
    private static final Logger logger = LoggerFactory.getLogger(QuizController.class);

    @Autowired
    private QuizService quizService;

    @GetMapping
    public List<Quiz> getAllQuizzes() {
        logger.info("Getting all quizzes");
        return quizService.getAllQuizzes();
    }

    @GetMapping("/user/{creatorId}")
    public List<Quiz> getQuizzesByCreator(@PathVariable String creatorId) {
        logger.info("Getting quizzes for creator: {}", creatorId);
        return quizService.getQuizzesByCreator(creatorId);
    }

    @GetMapping("/shared")
    public List<Quiz> getSharedQuizzes() {
        logger.info("Getting shared quizzes");
        return quizService.getSharedQuizzes();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Quiz> getQuizById(@PathVariable String id) {
        logger.info("Getting quiz by id: {}", id);
        return quizService.getQuizById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createQuiz(@RequestBody Quiz quiz) {
        try {
            logger.info("Creating new quiz: {}", quiz);
            Quiz createdQuiz = quizService.createQuiz(quiz);
            logger.info("Quiz created successfully with id: {}", createdQuiz.getId());
            return ResponseEntity.ok(createdQuiz);
        } catch (Exception e) {
            logger.error("Error creating quiz: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body("Error creating quiz: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Quiz> updateQuiz(@PathVariable String id, @RequestBody Quiz quizDetails) {
        try {
            logger.info("Updating quiz with id: {}", id);
            Quiz updatedQuiz = quizService.updateQuiz(id, quizDetails);
            logger.info("Quiz updated successfully");
            return ResponseEntity.ok(updatedQuiz);
        } catch (RuntimeException e) {
            logger.error("Error updating quiz: {}", e.getMessage(), e);
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuiz(@PathVariable String id) {
        try {
            logger.info("Deleting quiz with id: {}", id);
            quizService.deleteQuiz(id);
            logger.info("Quiz deleted successfully");
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            logger.error("Error deleting quiz: {}", e.getMessage(), e);
            return ResponseEntity.notFound().build();
        }
    }
} 