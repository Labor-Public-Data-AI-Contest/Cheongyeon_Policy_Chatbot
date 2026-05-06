package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long policyId;

    private String title;

    @Column(length = 1000)
    private String message;

    private boolean readStatus = false;

    private LocalDateTime createdAt = LocalDateTime.now();
}