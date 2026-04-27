package com.example.backend.controller;

import com.example.backend.config.JwtUtil;
import com.example.backend.dto.LoginRequestDto;
import com.example.backend.dto.LoginResponseDto;
import com.example.backend.dto.SignupRequestDto;
import com.example.backend.entity.User;
import com.example.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final JwtUtil jwtUtil;

    @PostMapping("/signup")
    public String signup(@RequestBody SignupRequestDto dto) {
        userService.signup(dto);
        return "회원가입 성공";
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDto dto) {
        try {
            User user = userService.login(dto);

            String token = jwtUtil.createToken(user.getUserid());

            return ResponseEntity.ok(new LoginResponseDto(
                    token,
                    user.getId(),
                    user.getUserid(),
                    user.getName()
            ));

        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(e.getMessage());
        }
    }
}