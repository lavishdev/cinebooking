package com.lavish.moviebookingapplication.Controller;

import com.lavish.moviebookingapplication.DTOs.LoginRequestdto;
import com.lavish.moviebookingapplication.DTOs.LoginResponsedto;
import com.lavish.moviebookingapplication.DTOs.RegisterRequestdto;
import com.lavish.moviebookingapplication.Models.User;
import com.lavish.moviebookingapplication.Services.AuthenticationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
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

    @GetMapping("/test-smtp")
    public ResponseEntity<String> testSmtpConnection() {
        try {
            long startTime = System.currentTimeMillis();
            java.net.Socket socket = new java.net.Socket();
            // Try connecting with a 5-second timeout
            socket.connect(new java.net.InetSocketAddress("smtp.gmail.com", 587), 5000);
            socket.close();
            long endTime = System.currentTimeMillis();
            return ResponseEntity.ok("SUCCESS: Connected to smtp.gmail.com:587 in " + (endTime - startTime) + "ms. Port is NOT blocked!");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("FAILED: Could not connect to smtp.gmail.com:587. Error: " + e.getMessage() + "\n\nThis confirms that the Render firewall is actively blocking outbound SMTP connections.");
        }
    }
}
