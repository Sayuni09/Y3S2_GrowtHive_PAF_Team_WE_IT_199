package com.growthive.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;
import lombok.Data;
import java.util.List;

@Data
public class Question {
    private String questionText;
    private List<String> options;
    private String correctAnswer;
} 