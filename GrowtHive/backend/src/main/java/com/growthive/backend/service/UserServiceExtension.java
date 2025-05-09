package com.growthive.backend.service;

import com.growthive.backend.model.User;
import com.growthive.backend.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserServiceExtension {
    private static final Logger logger = LoggerFactory.getLogger(UserServiceExtension.class);
    
    @Autowired
    private UserRepository userRepository;
    
    public List<User> searchUsers(String query) {
        logger.info("Searching users with query: {}", query);
        List<User> allUsers = userRepository.findAll();
        String lowercaseQuery = query.toLowerCase();
        
        List<User> filteredUsers = allUsers.stream()
                .filter(user -> 
                    (user.getName() != null && user.getName().toLowerCase().contains(lowercaseQuery)) ||
                    (user.getEmail() != null && user.getEmail().toLowerCase().contains(lowercaseQuery))
                )
                .collect(Collectors.toList());
                
        logger.info("Found {} users matching query: {}", filteredUsers.size(), query);
        return filteredUsers;
    }
    
    public List<User> getAllUsers() {
        logger.info("Retrieving all users");
        return userRepository.findAll();
    }
    
    public User getUserById(String userId) {
        logger.info("Retrieving user by ID: {}", userId);
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
    }
}
