package com.lavish.moviebookingapplication.Repository;

import com.lavish.moviebookingapplication.Models.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MovieRepo extends JpaRepository<Movie, Long> {

    public Optional<List<Movie >> findByGenre(String genre);


    public Optional<List<Movie>> findBylanguage(String language);

    Optional<List<Movie>> findByName(String name);
}
