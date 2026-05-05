package com.example.backend.controller;

import com.example.backend.dto.PolicyCardResponseDto;
import com.example.backend.service.PolicyService;
import lombok.RequiredArgsConstructor;
import com.example.backend.entity.Policy;

import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/policies")
@RequiredArgsConstructor
public class PolicyController {

    private final PolicyService policyService;

    @GetMapping("/popular")
    public List<PolicyCardResponseDto> getPopularPolicies() {
        return policyService.getPopularPolicies();
    }

    @GetMapping("/random")
    public List<PolicyCardResponseDto> getRandomPolicies() {
        return policyService.getRandomPolicies();
    }

    @GetMapping
    public Page<PolicyCardResponseDto> getPolicies(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return policyService.getPolicies(page, size);
    }

    @GetMapping("/search")
    public Page<PolicyCardResponseDto> searchPolicies(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return policyService.searchPolicies(keyword, page, size);
    }

    @GetMapping("/category")
    public Page<PolicyCardResponseDto> getByCategory(
            @RequestParam String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return policyService.getByCategory(category, page, size);
    }

    @GetMapping("/{id}")
    public Policy getPolicyDetail(@PathVariable Long id) {
        return policyService.getPolicyDetail(id);
    }

    @GetMapping("/recommend")
    public List<PolicyCardResponseDto> getRecommendedPolicies() {
        return policyService.getRandomByKeywords();
    }

    
}