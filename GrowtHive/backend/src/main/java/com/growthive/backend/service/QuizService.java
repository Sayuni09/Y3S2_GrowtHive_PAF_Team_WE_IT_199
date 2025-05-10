package com.growthive.backend.service;

import com.growthive.backend.model.Quiz;
import com.growthive.backend.repository.QuizRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class QuizService {
    private static final Logger logger = LoggerFactory.getLogger(QuizService.class);
    
    @Autowired
    private QuizRepository quizRepository;

    public List<Quiz> getAllQuizzes() {
        return quizRepository.findAll();
    }

    public List<Quiz> getQuizzesByCreator(String creatorId) {
        return quizRepository.findByCreatorId(creatorId);
    }

    public List<Quiz> getSharedQuizzes() {
        return quizRepository.findBySharedTrue();
    }

    public Optional<Quiz> getQuizById(String id) {
        return quizRepository.findById(id);
    }

    public Quiz createQuiz(Quiz quiz) {
        return quizRepository.save(quiz);
    }

    public Quiz updateQuiz(String id, Quiz quizDetails) {
        logger.info("Updating quiz with id: {}", id);
        Quiz quiz = quizRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Quiz not found with id: " + id));
        
        quiz.setTitle(quizDetails.getTitle());
        quiz.setDescription(quizDetails.getDescription());
        quiz.setShared(quizDetails.isShared());
        quiz.setQuestions(quizDetails.getQuestions());
        quiz.setHistory(quizDetails.getHistory());
        
        logger.info("Saving updated quiz with history: {}", quizDetails.getHistory());
        return quizRepository.save(quiz);
    }

    public void deleteQuiz(String id) {
        Quiz quiz = quizRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Quiz not found with id: " + id));
        quizRepository.delete(quiz);
    }
} 