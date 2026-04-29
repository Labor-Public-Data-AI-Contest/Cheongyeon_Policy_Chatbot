package com.example.backend.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ChatResponseDto {
    private String type;
    private String text;
    private List<PolicyDto> policies;
    private List<String> followUp;
}