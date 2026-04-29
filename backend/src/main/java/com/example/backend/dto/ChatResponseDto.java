package com.example.backend.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ChatResponseDto {
    private String type; // "text" or "policies"
    private String text;
    private List<PolicyCardDto> policies;
}