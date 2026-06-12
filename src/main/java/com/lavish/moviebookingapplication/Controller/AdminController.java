package com.lavish.moviebookingapplication.Controller;

import com.lavish.moviebookingapplication.DTOs.RegisterRequestdto;
import com.lavish.moviebookingapplication.Models.User;
import com.lavish.moviebookingapplication.Services.AuthenticationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private AuthenticationService authenticationService;



    @PostMapping("/register")
    public ResponseEntity<User> registerAdminUser(@RequestBody RegisterRequestdto registerRequestdto) {
        return ResponseEntity.ok(authenticationService.registerAdminUser(registerRequestdto));
    }
}
