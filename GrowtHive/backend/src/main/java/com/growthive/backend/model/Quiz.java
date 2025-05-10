package com.growthive.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
@Document(collection = "quizzes")
public class Quiz {
    @Id
    private String id;

    private String title;
    private String description;
    private boolean shared;
    private String creatorId;
    private List<Question> questions;
    private List<Map<String, Object>> history;
} 