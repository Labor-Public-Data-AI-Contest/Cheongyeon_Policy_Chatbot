package com.example.backend.repository;

import com.example.backend.entity.Policy;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

import java.util.List;


public interface PolicyRepository extends JpaRepository<Policy, Long> {
    Optional<Policy> findByPolicyNo(String policyNo);
    List<Policy> findTop5ByOrderByViewsDesc();
    @Query(value = "SELECT * FROM policies ORDER BY RAND() LIMIT 5", nativeQuery = true)
    List<Policy> findRandom5();
    Page<Policy> findAll(Pageable pageable);
    Page<Policy> findByTitleContainingIgnoreCase(String keyword, Pageable pageable);

}