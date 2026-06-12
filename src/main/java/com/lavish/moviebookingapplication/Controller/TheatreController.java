package com.lavish.moviebookingapplication.Controller;

import com.lavish.moviebookingapplication.DTOs.TheatreDto;
import com.lavish.moviebookingapplication.Services.TheatreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/theatre")
public class TheatreController {
    @Autowired
    private TheatreService theatreService;

    @PostMapping("/addtheatre")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> addTheatre(@RequestBody TheatreDto theatreDto) {
        return ResponseEntity.ok(theatreService.addTheatre(theatreDto));
    }

    @GetMapping("/gettheatrebylocation")
    public ResponseEntity<?> getTheatreByLocation(@RequestParam String theatreLocation) {
        return ResponseEntity.ok(theatreService.getTheatreByLocation(theatreLocation));
    }

    @PutMapping("/updatetheatre/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateTheatre(@PathVariable Long id, @RequestBody TheatreDto theatreDto) {
        return ResponseEntity.ok(theatreService.updateTheatre(id,theatreDto));
    }

    @DeleteMapping("/deletetheatre/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteTheatre(@PathVariable Long id) {
        theatreService.deleteTheatre(id);
        return ResponseEntity.ok().build();
    }
}
