package com.growthive.backend.repository;

import com.growthive.backend.model.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface NotificationRepository extends MongoRepository<Notification, String> {
    List<Notification> findByRecipientIdOrderByCreatedAtDesc(String recipientId);
    List<Notification> findByRecipientIdAndIsReadOrderByCreatedAtDesc(String recipientId, boolean isRead);
    long countByRecipientIdAndIsRead(String recipientId, boolean isRead);
}
