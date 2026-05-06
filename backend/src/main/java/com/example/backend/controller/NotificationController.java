package com.example.backend.controller;

import com.example.backend.dto.NotificationResponseDto;
import com.example.backend.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public List<NotificationResponseDto> getNotifications(Authentication authentication) {
        return notificationService.getNotifications(authentication);
    }

    @GetMapping("/unread-count")
    public long getUnreadCount(Authentication authentication) {
        return notificationService.getUnreadCount(authentication);
    }

    @PatchMapping("/{id}/read")
    public void readNotification(
            @PathVariable Long id,
            Authentication authentication
    ) {
        notificationService.readNotification(id, authentication);
    }
}