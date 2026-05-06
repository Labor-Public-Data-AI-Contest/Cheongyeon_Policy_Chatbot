package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(
        name = "notification_reads",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"notificationId", "userId"})
        }
)
public class NotificationRead {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long notificationId;

    private Long userId;
}