package com.example.backend.controller;

import com.example.backend.config.JwtUtil;
import com.example.backend.dto.UserResponseDto;
import com.example.backend.dto.UserUpdateRequestDto;
import com.example.backend.entity.User;
import com.example.backend.service.UserService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/user")
public class UserController {

    private final JwtUtil jwtUtil;
    private final UserService userService;

    @GetMapping("/me")
    public UserResponseDto me(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String userid = jwtUtil.getUserid(token);

        User user = userService.findByUserid(userid);

        UserResponseDto dto = new UserResponseDto();
        dto.setId(user.getId());
        dto.setUserid(user.getUserid());
        dto.setName(user.getName());
        dto.setAddress(user.getAddress());
        dto.setAge(user.getAge());

        return dto;
    }

    @PutMapping("/me")
    public User updateMe(
            HttpServletRequest request,
            @RequestBody UserUpdateRequestDto dto
    ) {
        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new IllegalArgumentException("토큰이 없습니다.");
        }

        String token = authHeader.substring(7);
        String userid = jwtUtil.getUserid(token);

        return userService.updateUser(userid, dto);
    }    
}