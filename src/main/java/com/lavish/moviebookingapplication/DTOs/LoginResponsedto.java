package com.lavish.moviebookingapplication.DTOs;

import lombok.Builder;
import lombok.Data;

import java.util.Set;

import com.lavish.moviebookingapplication.Models.Role;

@Data
@Builder
public class LoginResponsedto {
    private Long userId;
    private String jwtToken;
    private String username;
    private Set<Role> roles;
    private String message;
    private boolean requiresOtp;
}
