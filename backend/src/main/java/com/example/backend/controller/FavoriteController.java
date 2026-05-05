package com.example.backend.controller;

import com.example.backend.entity.Policy;
import com.example.backend.service.FavoriteService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/favorites")
public class FavoriteController {

    private final FavoriteService favoriteService;

    @PostMapping("/{policyId}")
    public void toggleFavorite(
            @PathVariable Long policyId,
            Authentication authentication
    ) {
        String userid = authentication.getName();
        favoriteService.toggle(userid, policyId);
    }

    @GetMapping("/me")
    public List<Policy> getMyFavorites(Authentication authentication) {
        String userid = authentication.getName();
        return favoriteService.getMyFavorites(userid);
    }
}