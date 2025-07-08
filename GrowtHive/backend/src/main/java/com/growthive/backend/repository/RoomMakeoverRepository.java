

package com.growthive.backend.repository;

import com.growthive.backend.model.RoomMakeover;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoomMakeoverRepository extends MongoRepository<RoomMakeover, String> {
    List<RoomMakeover> findByUserIdOrderByCreatedAtDesc(String userId);
    Optional<RoomMakeover> findByIdAndUserId(String id, String userId);
    List<RoomMakeover> findByIsPublicTrueOrderByCreatedAtDesc();
    List<RoomMakeover> findByIsPartOfChallengeAndChallengeId(boolean isPartOfChallenge, String challengeId);
}
