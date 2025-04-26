package com.growthive.backend.service;

import com.growthive.backend.model.User;
import com.growthive.backend.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class UserService {
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    public User registerUser(String name, String email, String password) {
        logger.info("Registering new user with email: {}", email);
        if (userRepository.existsByEmail(email)) {
            logger.warn("Registration failed: Email already in use: {}", email);
            throw new RuntimeException("Email is already in use!");
        }
        User user = User.builder()
                .name(name)
                .email(email)
                .password(passwordEncoder.encode(password))
                .roles(Set.of("ROLE_USER"))
                .provider("local")
                .build();
        User savedUser = userRepository.save(user);
        logger.info("User registered successfully: {}", email);
        return savedUser;
    }

    public Optional<User> findByEmail(String email) {
        logger.debug("Looking up user by email: {}", email);
        return userRepository.findByEmail(email);
    }
    
    public User saveUser(User user) {
        logger.info("Saving user: {}", user.getEmail());
        if (user.getPassword() != null && !user.getPassword().startsWith("$2a$")) {
            logger.debug("Encoding password for user: {}", user.getEmail());
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }
        return userRepository.save(user);
    }
}
