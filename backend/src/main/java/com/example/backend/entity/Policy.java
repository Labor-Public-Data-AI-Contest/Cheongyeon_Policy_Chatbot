package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "policies")
public class Policy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String policyNo;

    private String title;
    private String category;
    private String keywords;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String supportContent;

    private String applyStartDate;
    private String applyEndDate;

    private String businessStartDate;
    private String businessEndDate;

    @Column(columnDefinition = "TEXT")
    private String businessPeriodText;

    private String region;

    @Column(columnDefinition = "TEXT")
    private String incomeCondition;

    private String marriageStatus;

    private Integer minAge;
    private Integer maxAge;

    private String employmentCondition;
    private String educationCondition;
    private String majorCondition;
    private String specialCondition;

    @Column(columnDefinition = "TEXT")
    private String extraCondition;

    @Column(columnDefinition = "TEXT")
    private String restriction;

    @Column(columnDefinition = "TEXT")
    private String applyMethod;

    @Column(columnDefinition = "TEXT")
    private String screeningMethod;

    @Column(columnDefinition = "TEXT")
    private String applyUrl;

    @Column(columnDefinition = "TEXT")
    private String note;

    @Column(columnDefinition = "TEXT")
    private String referenceUrl1;

    @Column(columnDefinition = "TEXT")
    private String referenceUrl2;

    private Integer views = 0;
}