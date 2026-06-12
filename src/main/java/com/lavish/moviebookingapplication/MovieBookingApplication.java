package com.lavish.moviebookingapplication;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class MovieBookingApplication {

    public static void main(String[] args) {
        SpringApplication.run(MovieBookingApplication.class, args);
    }

    @Bean
    public org.springframework.boot.CommandLineRunner initAdmin(
            com.lavish.moviebookingapplication.Repository.UserRepo userRepo,
            org.springframework.security.crypto.password.PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepo.findByUsername("movieadmin").isEmpty()) {
                com.lavish.moviebookingapplication.Models.User admin = new com.lavish.moviebookingapplication.Models.User();
                admin.setUsername("movieadmin");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setEmail("movieadmin@example.com");
                
                java.util.Set<com.lavish.moviebookingapplication.Models.Role> roles = new java.util.HashSet<>();
                roles.add(com.lavish.moviebookingapplication.Models.Role.ROLE_ADMIN);
                roles.add(com.lavish.moviebookingapplication.Models.Role.ROLE_USER);
                admin.setRoles(roles);
                admin.setIsEnabled(true);
                
                userRepo.save(admin);
            }
        };
    }
}
