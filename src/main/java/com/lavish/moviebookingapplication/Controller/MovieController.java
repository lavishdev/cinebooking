package com.lavish.moviebookingapplication.Controller;

import com.lavish.moviebookingapplication.DTOs.Moviedto;
import com.lavish.moviebookingapplication.Models.Movie;
import com.lavish.moviebookingapplication.Services.MovieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/movies")
public class MovieController {
    @Autowired
    private MovieService movieService;



    @PostMapping(value = "/addmovie", consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Movie> addMovie(@ModelAttribute Moviedto moviedto, @RequestParam(value = "poster", required = false) org.springframework.web.multipart.MultipartFile poster) {
        return ResponseEntity.ok(movieService.addMovie(moviedto, poster));
    }


    @GetMapping("/getallmovies")
    public ResponseEntity<List<Movie>> getAllMovies() {
        return ResponseEntity.ok(movieService.getallmovie());
    }

    @GetMapping("/getmoviesbygenre")
    public ResponseEntity<List<Movie>> getMoviesByGenre(@RequestParam String genre) {
        return ResponseEntity.ok(movieService.getMoviesBygenre(genre));
    }

    @GetMapping("/getmoviesbylanguage")
    public ResponseEntity<List<Movie>> getMoviesBylanguage(@RequestParam String language) {
        return ResponseEntity.ok(movieService.getMoviesBylanguage(language));
    }

    @GetMapping("/getmoviesbytitle")
    public ResponseEntity<List<Movie>> getMoviestitle(@RequestParam String title) {
        return ResponseEntity.ok(movieService.getMoviesBytitle(title));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping(value = "/updatemovie/{id}", consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Movie> updateMovie(@PathVariable Long id, @ModelAttribute Moviedto moviedto, @RequestParam(value = "poster", required = false) org.springframework.web.multipart.MultipartFile poster) {
        return ResponseEntity.ok(movieService.updateMovie(id, moviedto, poster));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/deletemovie/{id}")
    public ResponseEntity<Movie> deleteMovie(@PathVariable Long id) {
        movieService.deleteMovie(id);
        return ResponseEntity.ok().build();
    }
}
