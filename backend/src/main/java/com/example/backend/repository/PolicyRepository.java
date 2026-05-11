package com.example.backend.repository;

import com.example.backend.entity.Policy;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.List;

public interface PolicyRepository extends JpaRepository<Policy, Long> {

    Optional<Policy> findByPolicyNo(String policyNo);

    List<Policy> findTop5ByActiveTrueOrderByViewsDesc();

    boolean existsByPolicyNo(String policyNo);

    @Query(value = "SELECT * FROM policies WHERE active = 1 ORDER BY RAND() LIMIT 5", nativeQuery = true)
    List<Policy> findRandom5();

    Page<Policy> findByActiveTrue(Pageable pageable);

    Page<Policy> findByTitleContainingIgnoreCaseAndActiveTrue(String keyword, Pageable pageable);

    Page<Policy> findByCategoryContainingIgnoreCaseAndActiveTrue(String keyword, Pageable pageable);

    @Query(value = """
            SELECT * FROM policies
            WHERE active = 1
              AND (
                   keywords LIKE CONCAT('%', :k1, '%')
                OR keywords LIKE CONCAT('%', :k2, '%')
                OR keywords LIKE CONCAT('%', :k3, '%')
              )
            ORDER BY RAND()
            LIMIT 5
            """, nativeQuery = true)
    List<Policy> findRandomByMultipleKeywords(
            @Param("k1") String k1,
            @Param("k2") String k2,
            @Param("k3") String k3
    );
}