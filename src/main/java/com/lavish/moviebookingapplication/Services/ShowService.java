package com.lavish.moviebookingapplication.Services;

import com.lavish.moviebookingapplication.DTOs.Showdto;
import com.lavish.moviebookingapplication.Models.Booking;
import com.lavish.moviebookingapplication.Models.Movie;
import com.lavish.moviebookingapplication.Models.Show;
import com.lavish.moviebookingapplication.Models.Theatre;
import com.lavish.moviebookingapplication.Repository.MovieRepo;
import com.lavish.moviebookingapplication.Repository.ShowRepo;
import com.lavish.moviebookingapplication.Repository.TheatreRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.swing.text.html.Option;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import com.lavish.moviebookingapplication.Models.BookingStatus;

@Service
public class ShowService {
    @Autowired
    private ShowRepo showRepo;

    @Autowired
    private MovieRepo movieRepo;

    @Autowired
    private TheatreRepo theatreRepo;

    public Show createShow(Showdto showdto) {
        Movie movie = movieRepo.findById(showdto.getMovieId())
                .orElseThrow(()-> new RuntimeException("Movie Not Found"));

        Theatre theatre = theatreRepo.findById(showdto.getTheatreId())
                .orElseThrow(()-> new RuntimeException("Theatre Not Found"));

        Show show = new Show();
        show.setShowTime(showdto.getShowTime());
        show.setPrice(showdto.getPrice());
        show.setMovie(movie);
        show.setTheatre(theatre);
        return showRepo.save(show);
    }




    public List<Show> getShowsByTheatre(Long theatreId) {
        Optional<List<Show>> TheatreListBox = showRepo.getShowsByTheatreId(theatreId);
        return TheatreListBox.orElse(java.util.Collections.emptyList());
    }

    public Show updateShow(Long id, Showdto showdto) {
        Show show = showRepo.findById(id)
                .orElseThrow(()-> new RuntimeException("Show Not Found"));

        Movie movie = movieRepo.findById(showdto.getMovieId())
                .orElseThrow(()-> new RuntimeException("Movie Not Found"));

        Theatre theatre = theatreRepo.findById(showdto.getTheatreId())
                .orElseThrow(()-> new RuntimeException("Theatre Not Found"));

        show.setShowTime(showdto.getShowTime());
        show.setPrice(showdto.getPrice());
        show.setMovie(movie);
        show.setTheatre(theatre);

        return showRepo.save(show);


    }

    public void deleteShow(Long id) {
        if(!showRepo.existsById(id)) {
            throw new RuntimeException("No Show Found");
        }
        List<Booking> bookings = showRepo.findById(id).get().getBookings();
        if(!bookings.isEmpty()) {
            throw new RuntimeException("No Booking Found");
        }

            showRepo.deleteById(id);


    }

    public List<Show> getAllShows() {
        return showRepo.findAll();
    }

    public List<Show> getShowsByMovie(Long movieId) {
        Optional<List<Show>> ShowListBox = showRepo.getShowsByMovieId(movieId);
        return ShowListBox.orElse(java.util.Collections.emptyList());
    }

    public Set<String> getOccupiedSeats(Long showId) {
        Show show = showRepo.findById(showId)
                .orElseThrow(() -> new RuntimeException("Show not found"));
        return show.getBookings().stream()
                .filter(b -> b.getBookingStatus() != BookingStatus.CANCELLED)
                .flatMap(b -> b.getSeatNumbers().stream())
                .collect(Collectors.toSet());
    }
}
