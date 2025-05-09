package com.growthive.backend.repository;

import com.growthive.backend.model.Profile;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface ProfileRepository extends MongoRepository<Profile, String> {
    Optional<Profile> findByUserId(String userId);
    Optional<Profile> findByEmail(String email);
    boolean existsByUserId(String userId);
}

