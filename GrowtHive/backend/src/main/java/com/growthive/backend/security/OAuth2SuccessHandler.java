package com.growthive.backend.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.growthive.backend.model.User;
import com.growthive.backend.service.UserService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private static final Logger logger = LoggerFactory.getLogger(OAuth2SuccessHandler.class);
    private final UserService userService;
    private final JwtUtils jwtUtils;
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    @Value("${app.frontend.url:http://localhost:3000}")
    private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, 
                                       Authentication authentication) throws IOException, ServletException {
        try {
            logger.info("OAuth2 authentication success handler triggered");
            
            OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();
            logger.info("OAuth2User class: {}", oauth2User.getClass().getName());
            logger.info("OAuth2User attributes: {}", oauth2User.getAttributes());
            
            // Get email and name from attributes - Google stores these directly
            String email = oauth2User.getAttribute("email");
            String name = oauth2User.getAttribute("name");
            
            if (email == null) {
                logger.error("Email attribute not found in OAuth2 user");
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("{\"error\":\"Email not provided by OAuth2 provider\"}");
                return;
            }
            
            logger.info("Processing OAuth2 login for email: {}", email);
            
            // Find or create the user
            User user = userService.findByEmail(email).orElseGet(() -> {
                logger.info("Creating new user for OAuth2 login with email: {}", email);
                User newUser = User.builder()
                        .name(name != null ? name : "Google User")
                        .email(email)
                        .password(UUID.randomUUID().toString()) // Random password for OAuth users
                        .roles(Set.of("ROLE_USER"))
                        .provider("google")
                        .build();
                return userService.saveUser(newUser);
            });
            
            // Generate JWT token
            String token = jwtUtils.generateJwtToken(user.getId(), user.getEmail());
            logger.info("Generated JWT token for user: {}", email);
            
            // Create user info JSON
            String userInfo = objectMapper.writeValueAsString(Map.of(
                "id", user.getId(),
                "name", user.getName(),
                "email", user.getEmail(),
                "roles", user.getRoles()
            ));
            
            // Encode parameters for URL
            String encodedToken = URLEncoder.encode(token, StandardCharsets.UTF_8.toString());
            String encodedUserInfo = URLEncoder.encode(userInfo, StandardCharsets.UTF_8.toString());
            
            // Redirect to frontend dashboard with token and user info as query parameters
            String redirectUrl = frontendUrl + "/login/oauth2/callback?token=" + encodedToken + "&user=" + encodedUserInfo;
            logger.info("Redirecting to: {}", redirectUrl);
            
            response.sendRedirect(redirectUrl);
        } catch (Exception e) {
            logger.error("Error in OAuth2 success handler", e);
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }
}
