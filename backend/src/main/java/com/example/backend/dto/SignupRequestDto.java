package com.example.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SignupRequestDto {

    private String userid;
    private String userpassword;
    private String name;
    private String address;
    private String birth;  
}
