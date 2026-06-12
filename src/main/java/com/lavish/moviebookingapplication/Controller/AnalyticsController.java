package com.lavish.moviebookingapplication.Controller;

import com.lavish.moviebookingapplication.DTOs.AnalyticsResponsedto;
import com.lavish.moviebookingapplication.Services.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping("/analytics")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AnalyticsResponsedto> getAnalytics() {
        return ResponseEntity.ok(analyticsService.getAnalytics());
    }
}
