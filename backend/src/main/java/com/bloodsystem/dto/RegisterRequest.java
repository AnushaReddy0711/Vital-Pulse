package com.bloodsystem.dto;

import com.bloodsystem.entity.Role;
import lombok.Data;

@Data
public class RegisterRequest {
    private String name;
    private String email;
    private String password;
    private Role role;
    private String city;
}
