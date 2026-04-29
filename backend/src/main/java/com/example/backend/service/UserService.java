package com.example.backend.service;

import com.example.backend.dto.LoginRequestDto;
import com.example.backend.dto.SignupRequestDto;
import com.example.backend.dto.UserUpdateRequestDto;
import com.example.backend.entity.User;
import com.example.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public void signup(SignupRequestDto dto) {

        if (userRepository.existsByUserid(dto.getUserid())) {
            throw new IllegalArgumentException("이미 존재하는 아이디입니다.");
        }

        User user = new User();
        user.setUserid(dto.getUserid());
        user.setUserpassword(passwordEncoder.encode(dto.getUserpassword()));
        user.setName(dto.getName());
        user.setAddress(dto.getAddress());
        user.setAge(dto.getAge());

        userRepository.save(user);
    }

    public User login(LoginRequestDto dto) {

        User user = userRepository.findByUserid(dto.getUserid())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 아이디입니다."));

        if (!passwordEncoder.matches(dto.getUserpassword(), user.getUserpassword())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        return user;
    }

    public User findByUserid(String userid) {
        return userRepository.findByUserid(userid)
            .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
    }

    public User updateUser(String userid, UserUpdateRequestDto dto) {
        User user = userRepository.findByUserid(userid)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        user.setName(dto.getName());
        user.setAddress(dto.getAddress());
        user.setAge(dto.getAge());

        return userRepository.save(user);
    }

    public boolean existsByUserid(String userid) {
        return userRepository.existsByUserid(userid);
    }

}