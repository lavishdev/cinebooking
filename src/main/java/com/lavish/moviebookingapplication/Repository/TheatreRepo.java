package com.lavish.moviebookingapplication.Repository;

import com.lavish.moviebookingapplication.Models.Theatre;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TheatreRepo extends JpaRepository<Theatre,Long> {
    Optional<List<Theatre>> findByTheatreLocation(String theatreLocation);
}
