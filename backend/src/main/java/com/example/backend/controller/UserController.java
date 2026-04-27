package com.example.backend.controller;

import com.example.backend.config.JwtUtil;
import com.example.backend.dto.UserResponseDto;
import com.example.backend.entity.User;
import com.example.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

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
}