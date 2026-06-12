package com.lavish.moviebookingapplication.Services;

import com.lavish.moviebookingapplication.DTOs.Moviedto;
import com.lavish.moviebookingapplication.Models.Movie;
import com.lavish.moviebookingapplication.Repository.MovieRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@Service
public class MovieService {

    @Autowired
    private MovieRepo movierepo;

    @Autowired
    private FileStorageService fileStorageService;

    public Movie addMovie(Moviedto moviedto, MultipartFile poster) {
        Movie movie = new Movie();
        movie.setName(moviedto.getName());
        movie.setDescription(moviedto.getDescription());
        movie.setDuration(moviedto.getDuration());
        movie.setGenre(moviedto.getGenre());
        movie.setLanguage(moviedto.getLanguage());
        movie.setReleaseDate(moviedto.getReleaseDate());

        if (poster != null && !poster.isEmpty()) {
            String posterUrl = fileStorageService.storeFile(poster);
            movie.setPosterUrl(posterUrl);
        }

        return movierepo.save(movie);
    }

    public List<Movie> getallmovie() {
        return movierepo.findAll();
    }

    public List<Movie> getMoviesBygenre(String genre) {
        Optional<List<Movie>> listofmovieBox = movierepo.findByGenre(genre);
        return listofmovieBox.orElse(java.util.Collections.emptyList());
    }

    public List<Movie> getMoviesBytitle(String title) {
        Optional<List<Movie>> listofmovieBox = movierepo.findByName(title);
        return listofmovieBox.orElse(java.util.Collections.emptyList());
    }

    public Movie updateMovie(Long id, Moviedto moviedto, MultipartFile poster) {
        Movie movie = movierepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Movie with id " + id + " not found"));
        movie.setName(moviedto.getName());
        movie.setDescription(moviedto.getDescription());
        movie.setDuration(moviedto.getDuration());
        movie.setGenre(moviedto.getGenre());
        movie.setLanguage(moviedto.getLanguage());
        movie.setReleaseDate(moviedto.getReleaseDate());
        
        if (poster != null && !poster.isEmpty()) {
            String posterUrl = fileStorageService.storeFile(poster);
            movie.setPosterUrl(posterUrl);
        }
        
        return movierepo.save(movie);
    }

    public void deleteMovie(Long id) {
        movierepo.deleteById(id);
    }

    public List<Movie> getMoviesBylanguage(String language) {
        Optional<List<Movie>> listofmovieBox = movierepo.findBylanguage(language);
        return listofmovieBox.orElse(java.util.Collections.emptyList());
    }
}
