package com.example.backend.dto;

import java.time.LocalDate;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserResponseDto {

    private Long id;
    private String userid;
    private String name;
    private String address;
    private String birth;
    private int age;
}
