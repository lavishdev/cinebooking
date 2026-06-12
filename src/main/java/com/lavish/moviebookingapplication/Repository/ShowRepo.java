package com.lavish.moviebookingapplication.Repository;

import com.lavish.moviebookingapplication.Models.Show;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ShowRepo extends JpaRepository<Show, Long> {


    Optional<List<Show>> getShowsByMovieId(Long movieId);

    Optional<List<Show>> getShowsByTheatreId(Long theatreId);
}
