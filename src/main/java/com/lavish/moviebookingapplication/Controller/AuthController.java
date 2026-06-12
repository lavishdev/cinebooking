package com.lavish.moviebookingapplication.Controller;

import com.lavish.moviebookingapplication.DTOs.LoginRequestdto;
import com.lavish.moviebookingapplication.DTOs.LoginResponsedto;
import com.lavish.moviebookingapplication.DTOs.RegisterRequestdto;
import com.lavish.moviebookingapplication.Models.User;
import com.lavish.moviebookingapplication.Services.AuthenticationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationService authenticationService;

    @PostMapping("/registernormaluser")
    public ResponseEntity<User> registerNormalUser(@RequestBody RegisterRequestdto registerRequestdto) {
        return ResponseEntity.ok(authenticationService.registerNormalUser(registerRequestdto));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponsedto> login(@RequestBody LoginRequestdto loginRequestdto) {
        return ResponseEntity.ok(authenticationService.login(loginRequestdto));
    }

    @PostMapping("/verify-login-otp")
    public ResponseEntity<LoginResponsedto> verifyLoginOtp(@RequestBody com.lavish.moviebookingapplication.DTOs.OtpVerifyRequestdto dto) {
        return ResponseEntity.ok(authenticationService.verifyLoginOtp(dto));
    }

    @PostMapping("/verify-register-otp")
    public ResponseEntity<LoginResponsedto> verifyRegisterOtp(@RequestBody com.lavish.moviebookingapplication.DTOs.OtpVerifyRequestdto dto) {
        // After verifying registration OTP, we can just treat it as a successful login
        return ResponseEntity.ok(authenticationService.verifyLoginOtp(dto));
    }
}
