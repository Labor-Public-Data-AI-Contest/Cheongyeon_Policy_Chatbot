package com.example.backend.dto;

import com.example.backend.entity.Policy;
import lombok.Getter;

@Getter
public class PolicyCardResponseDto {

    private Long id;
    private String title;
    private String desc;
    private String category;
    private String region;
    private String keywords;
    private Integer views;

    public PolicyCardResponseDto(Policy policy) {
        this.id = policy.getId();
        this.title = policy.getTitle();
        this.desc = policy.getDescription();
        this.category = policy.getCategory();
        this.keywords = policy.getKeywords();
        this.region = policy.getRegion();
        this.views = policy.getViews();
    }
}