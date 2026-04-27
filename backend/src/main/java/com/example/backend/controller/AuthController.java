package com.example.backend.controller;

import com.example.backend.dto.LoginRequestDto;
import com.example.backend.dto.SignupRequestDto;
import com.example.backend.dto.UserResponseDto;
import com.example.backend.entity.User;
import com.example.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    // 회원가입
    @PostMapping("/signup")
    public String signup(@RequestBody SignupRequestDto dto) {
        userService.signup(dto);
        return "회원가입 성공";
    }

    // 로그인
    @PostMapping("/login")
    public UserResponseDto login(@RequestBody LoginRequestDto dto) {
        User user = userService.login(dto);

        // Entity → DTO 변환
        UserResponseDto res = new UserResponseDto();
        res.setId(user.getId());
        res.setUserid(user.getUserid());
        res.setName(user.getName());
        res.setAddress(user.getAddress());
        res.setAge(user.getAge());

        return res;
    }
}