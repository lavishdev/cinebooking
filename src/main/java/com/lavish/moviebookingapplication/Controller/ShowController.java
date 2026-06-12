package com.lavish.moviebookingapplication.Controller;

import com.lavish.moviebookingapplication.DTOs.Showdto;
import com.lavish.moviebookingapplication.Models.Show;
import com.lavish.moviebookingapplication.Services.ShowService;
import jakarta.annotation.PostConstruct;
import jakarta.persistence.Entity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/show")
public class ShowController {
    @Autowired
    private ShowService showService;

    @PostMapping("/createshow")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Show> createShow(@RequestBody Showdto showdto) {
        return ResponseEntity.ok(showService.createShow(showdto));
    }

    @GetMapping("/getallshows")
    public ResponseEntity<List<Show>> getAllShows() {
        return ResponseEntity.ok(showService.getAllShows());
    }

    @GetMapping("/getshowsbymovie/{id}")
    public ResponseEntity<List<Show>> getShowByMovie(@PathVariable("id") Long movieId) {
        return ResponseEntity.ok(showService.getShowsByMovie(movieId));
    }

    @GetMapping("/getshowsbytheatre/{id}")
    public ResponseEntity<List<Show>> getShowByTheatre(@PathVariable("id") Long theatreId) {
        return ResponseEntity.ok(showService.getShowsByTheatre(theatreId));
    }

    @PutMapping("/updateshow/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Show> updateShow(@PathVariable Long id, @RequestBody Showdto showdto) {
        return ResponseEntity.ok(showService.updateShow(id, showdto));
    }

    @DeleteMapping("/deleteshow/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteShow(@PathVariable Long id) {
        showService.deleteShow(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}/seats")
    public ResponseEntity<Set<String>> getOccupiedSeats(@PathVariable Long id) {
        return ResponseEntity.ok(showService.getOccupiedSeats(id));
    }
}
