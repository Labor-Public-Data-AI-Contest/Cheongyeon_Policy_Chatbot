package com.example.backend.service;

import com.example.backend.entity.Favorite;
import com.example.backend.entity.Policy;
import com.example.backend.entity.User;
import com.example.backend.repository.FavoriteRepository;
import com.example.backend.repository.PolicyRepository;
import com.example.backend.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final UserRepository userRepository;
    private final PolicyRepository policyRepository;

    @Transactional
    public void toggle(String userid, Long policyId) {
        User user = userRepository.findByUserid(userid)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없음: " + userid));

        Policy policy = policyRepository.findById(policyId)
                .orElseThrow(() -> new RuntimeException("정책을 찾을 수 없음: " + policyId));

        if (favoriteRepository.existsByUserAndPolicy(user, policy)) {
            favoriteRepository.deleteByUserAndPolicy(user, policy);
        } else {
            Favorite fav = new Favorite();
            fav.setUser(user);
            fav.setPolicy(policy);
            favoriteRepository.save(fav);
        }
    }

    public List<Policy> getMyFavorites(String userid) {
        User user = userRepository.findByUserid(userid)
                .orElseThrow();

        return favoriteRepository.findByUser(user)
                .stream()
                .map(Favorite::getPolicy)
                .toList();
    }
}