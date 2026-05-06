package com.example.backend.repository;

import com.example.backend.entity.NotificationRead;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationReadRepository extends JpaRepository<NotificationRead, Long> {

    boolean existsByNotificationIdAndUserId(Long notificationId, Long userId);

    long countByUserId(Long userId);

    List<NotificationRead> findByUserId(Long userId);
}