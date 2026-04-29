package com.example.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PolicyDto {

    private String id;
    private String title;
    private String region;
    private String amount;
    private String deadline;
    private String reason;
    private String url;
}