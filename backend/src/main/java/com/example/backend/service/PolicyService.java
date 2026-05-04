package com.example.backend.service;

import com.example.backend.dto.PolicyCardResponseDto;
import com.example.backend.repository.PolicyRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.example.backend.entity.Policy;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PolicyService {

    private final PolicyRepository policyRepository;

    public List<PolicyCardResponseDto> getPopularPolicies() {
        return policyRepository.findTop5ByOrderByViewsDesc()
                .stream()
                .map(PolicyCardResponseDto::new)
                .toList();
    }

    public List<PolicyCardResponseDto> getRandomPolicies() {
        return policyRepository.findRandom5()
                .stream()
                .map(PolicyCardResponseDto::new)
                .toList();
    }

    public Page<PolicyCardResponseDto> getPolicies(int page, int size) {
        return policyRepository.findAll(PageRequest.of(page, size))
                .map(PolicyCardResponseDto::new);
    }

    public Page<PolicyCardResponseDto> searchPolicies(String keyword, int page, int size) {
        return policyRepository
                .findByTitleContainingIgnoreCase(keyword, PageRequest.of(page, size))
                .map(PolicyCardResponseDto::new);
    }

    public Policy getPolicyDetail(Long id) {
        return policyRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("정책을 찾을 수 없습니다."));
    }

    public List<PolicyCardResponseDto> getRandomByKeywords() {
        return policyRepository
                .findRandomByMultipleKeywords("인턴", "장기미취업청년", "교육지원")
                .stream()
                .map(PolicyCardResponseDto::new)
                .toList();
    }
}