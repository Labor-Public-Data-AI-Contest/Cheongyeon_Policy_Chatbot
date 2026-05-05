package com.example.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.entity.Favorite;
import com.example.backend.entity.Policy;
import com.example.backend.entity.User;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    boolean existsByUserAndPolicy(User user, Policy policy);

    void deleteByUserAndPolicy(User user, Policy policy);

    List<Favorite> findByUser(User user);
}
