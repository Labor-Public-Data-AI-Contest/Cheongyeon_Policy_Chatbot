package com.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class NotificationResponseDto {

    private Long id;
    private Long policyId;
    private String title;
    private String message;
    private boolean readStatus;
    private LocalDateTime createdAt;
}