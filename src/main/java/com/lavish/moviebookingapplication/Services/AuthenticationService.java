package com.lavish.moviebookingapplication.Services;

import com.lavish.moviebookingapplication.DTOs.LoginRequestdto;
import com.lavish.moviebookingapplication.DTOs.LoginResponsedto;
import com.lavish.moviebookingapplication.DTOs.OtpVerifyRequestdto;
import com.lavish.moviebookingapplication.DTOs.RegisterRequestdto;
import com.lavish.moviebookingapplication.JWT.JwtService;
import com.lavish.moviebookingapplication.Models.User;
import com.lavish.moviebookingapplication.Models.Role;
import com.lavish.moviebookingapplication.Repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

@Service
public class AuthenticationService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private OtpService otpService;

    public User registerNormalUser(RegisterRequestdto registerRequestdto) {
        if(userRepo.findByUsername(registerRequestdto.getUsername()).isPresent()) {
            throw new RuntimeException("User already exists");
        }
        Set<Role> roles = new HashSet<Role>();
        roles.add(Role.ROLE_USER);

        User user = new User();
        user.setUsername(registerRequestdto.getUsername());
        user.setPassword(passwordEncoder.encode(registerRequestdto.getPassword()));
        user.setEmail(registerRequestdto.getEmail());
        user.setRoles(roles);
        user.setIsEnabled(false); // Must verify OTP
        user = userRepo.save(user);

        otpService.generateAndSendOtp(user.getEmail());
        return user;
    }

    public LoginResponsedto login(LoginRequestdto loginRequestdto) {
        User user  = userRepo.findByUsername(loginRequestdto.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequestdto.getUsername(),
                        loginRequestdto.getPassword()
                )
        );

        if (user.getIsEnabled() != null && !user.getIsEnabled()) {
            // Re-send OTP if they try to login before verifying
            otpService.generateAndSendOtp(user.getEmail());
            String maskedEmail = maskEmail(user.getEmail());
            return LoginResponsedto.builder()
                    .message("Account not verified. A new OTP has been sent to this mail " + maskedEmail)
                    .requiresOtp(true)
                    .username(user.getUsername())
                    .build();
        }

        // 🛡️ Admin Bypass: Admins do not require 2FA OTP to login
        boolean isAdmin = user.getRoles().stream()
                .anyMatch(role -> role == Role.ROLE_ADMIN);
                
        if (isAdmin) {
            String token = jwtService.generateToken(user);
            return LoginResponsedto.builder()
                    .userId(user.getId())
                    .jwtToken(token)
                    .username(user.getUsername())
                    .roles(user.getRoles())
                    .message("Admin Login successful")
                    .requiresOtp(false)
                    .build();
        }

        // Send Login OTP for normal users
        otpService.generateAndSendOtp(user.getEmail());
        String maskedEmail = maskEmail(user.getEmail());
        return LoginResponsedto.builder()
                .message("OTP has been sent to this mail " + maskedEmail)
                .requiresOtp(true)
                .username(user.getUsername())
                .build();
    }

    private String maskEmail(String email) {
        if (email == null || !email.contains("@")) return email;
        String[] parts = email.split("@");
        String name = parts[0];
        String domain = parts[1];
        if (name.length() <= 3) {
            return "***@" + domain;
        }
        int maskLength = name.length() - 3;
        String masked = "*".repeat(maskLength);
        String visible = name.substring(maskLength);
        return masked + visible + "@" + domain;
    }

    public LoginResponsedto verifyLoginOtp(OtpVerifyRequestdto dto) {
        User user = userRepo.findByUsername(dto.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        boolean isValid = otpService.verifyOtp(user.getEmail(), dto.getOtpCode());
        if (!isValid) {
            throw new RuntimeException("Invalid or expired OTP");
        }

        // If it was their first time verifying, enable the account
        if (user.getIsEnabled() != null && !user.getIsEnabled()) {
            user.setIsEnabled(true);
            userRepo.save(user);
        }

        String token = jwtService.generateToken(user);
        return LoginResponsedto.builder()
                .userId(user.getId())
                .jwtToken(token)
                .username(user.getUsername())
                .roles(user.getRoles())
                .message("Login successful")
                .requiresOtp(false)
                .build();
    }

    public User registerAdminUser(RegisterRequestdto registerRequestdto) {
        if(userRepo.findByUsername(registerRequestdto.getUsername()).isPresent()) {
            throw new RuntimeException("User already exists");
        }
        Set<Role> roles = new HashSet<Role>();
        roles.add(Role.ROLE_ADMIN);
        roles.add(Role.ROLE_USER);

        User user = new User();
        user.setUsername(registerRequestdto.getUsername());
        user.setPassword(passwordEncoder.encode(registerRequestdto.getPassword()));
        user.setEmail(registerRequestdto.getEmail());
        user.setRoles(roles);
        user.setIsEnabled(true); // Admins bypass OTP for simplicity
        return userRepo.save(user);
    }
}
