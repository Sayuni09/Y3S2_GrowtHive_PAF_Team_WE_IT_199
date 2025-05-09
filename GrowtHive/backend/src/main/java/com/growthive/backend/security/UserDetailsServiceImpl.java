package com.growthive.backend.security;

import com.growthive.backend.model.User;
import com.growthive.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {
    private static final Logger logger = LoggerFactory.getLogger(UserDetailsServiceImpl.class);
    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Try to find by ID first
        User user = userRepository.findById(username)
                .orElse(null);
                
        // If not found by ID, try by email
        if (user == null) {
            user = userRepository.findByEmail(username)
                    .orElseThrow(() -> new UsernameNotFoundException(
                            "User Not Found with username/email: " + username));
        }
        
        logger.debug("User found: {} with id: {}", user.getEmail(), user.getId());
        return new UserDetailsImpl(user);
    }
}
