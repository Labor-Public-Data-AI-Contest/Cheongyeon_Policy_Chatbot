package com.example.backend.service;

import com.example.backend.dto.NotificationResponseDto;
import com.example.backend.entity.Notification;
import com.example.backend.entity.NotificationRead;
import com.example.backend.entity.Policy;
import com.example.backend.entity.User;
import com.example.backend.repository.NotificationReadRepository;
import com.example.backend.repository.NotificationRepository;
import com.example.backend.repository.PolicyRepository;
import com.example.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final NotificationReadRepository notificationReadRepository;
    private final UserRepository userRepository;
    private final PolicyRepository policyRepository;

    public void createNewPolicyNotification(Policy policy) {
        Notification notification = new Notification();

        notification.setPolicyId(policy.getId());
        notification.setTitle("새로운 정책이 추가되었습니다");
        notification.setMessage(policy.getTitle() + " 정책이 새로 등록되었습니다.");

        notificationRepository.save(notification);
    }

    public List<NotificationResponseDto> getNotifications(Authentication authentication) {
        List<Notification> notifications =
                notificationRepository.findAllByOrderByCreatedAtDesc();

        User loginUser = getLoginUser(authentication);

        if (loginUser != null) {
            notifications = notifications.stream()
                    .filter(notification -> isUserRegionNotification(notification, loginUser))
                    .toList();
        }

        if (loginUser == null) {
            return notifications.stream()
                    .map(notification -> toDto(notification, false))
                    .toList();
        }

        Set<Long> readNotificationIds = new HashSet<>(
                notificationReadRepository.findByUserId(loginUser.getId())
                        .stream()
                        .map(NotificationRead::getNotificationId)
                        .toList()
        );

        return notifications.stream()
                .map(notification ->
                        toDto(notification, readNotificationIds.contains(notification.getId()))
                )
                .toList();
    }

    public long getUnreadCount(Authentication authentication) {
        List<Notification> notifications =
                notificationRepository.findAllByOrderByCreatedAtDesc();

        User loginUser = getLoginUser(authentication);

        if (loginUser != null) {
            notifications = notifications.stream()
                    .filter(notification -> isUserRegionNotification(notification, loginUser))
                    .toList();
        }

        if (loginUser == null) {
            return notifications.size();
        }

        Set<Long> readNotificationIds = new HashSet<>(
                notificationReadRepository.findByUserId(loginUser.getId())
                        .stream()
                        .map(NotificationRead::getNotificationId)
                        .toList()
        );

        return notifications.stream()
                .filter(notification -> !readNotificationIds.contains(notification.getId()))
                .count();
    }

    public void readNotification(Long notificationId, Authentication authentication) {
        User loginUser = getLoginUser(authentication);

        if (loginUser == null) {
            return;
        }

        boolean alreadyRead =
                notificationReadRepository.existsByNotificationIdAndUserId(
                        notificationId,
                        loginUser.getId()
                );

        if (alreadyRead) {
            return;
        }

        NotificationRead read = new NotificationRead();
        read.setNotificationId(notificationId);
        read.setUserId(loginUser.getId());

        notificationReadRepository.save(read);
    }

    private NotificationResponseDto toDto(Notification notification, boolean readStatus) {
        return new NotificationResponseDto(
                notification.getId(),
                notification.getPolicyId(),
                notification.getTitle(),
                notification.getMessage(),
                readStatus,
                notification.getCreatedAt()
        );
    }

    private User getLoginUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }

        String userid = authentication.getName();

        return userRepository.findByUserid(userid).orElse(null);
    }

    private boolean isUserRegionNotification(Notification notification, User user) {
        if (notification.getPolicyId() == null) {
            return true;
        }

        Policy policy = policyRepository.findById(notification.getPolicyId())
                .orElse(null);

        if (policy == null) {
            return false;
        }

        return isRegionMatched(policy.getRegion(), user.getAddress());
    }

    private boolean isRegionMatched(String policyRegion, String userAddress) {
        if (policyRegion == null || policyRegion.isBlank()) {
            return true;
        }

        if (policyRegion.contains("전국")) {
            return true;
        }

        if (userAddress == null || userAddress.isBlank()) {
            return false;
        }

        String normalizedPolicyRegion = policyRegion.replaceAll("\\s+", "");
        String normalizedUserAddress = userAddress.replaceAll("\\s+", "");

        String[] addressParts = userAddress.trim().split("\\s+");
        String sido = addressParts.length > 0 ? addressParts[0] : "";
        String sigungu = addressParts.length > 1 ? addressParts[1] : "";

        return normalizedPolicyRegion.contains(normalizedUserAddress)
                || (!sido.isBlank() && normalizedPolicyRegion.contains(sido))
                || (!sigungu.isBlank() && normalizedPolicyRegion.contains(sigungu));
    }
}