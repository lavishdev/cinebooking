package com.lavish.moviebookingapplication.Services;

import com.lavish.moviebookingapplication.DTOs.Bookingdto;
import com.lavish.moviebookingapplication.Models.Booking;
import com.lavish.moviebookingapplication.Models.BookingStatus;
import com.lavish.moviebookingapplication.Models.Show;
import com.lavish.moviebookingapplication.Models.User;
import com.lavish.moviebookingapplication.Repository.BookingRepo;
import com.lavish.moviebookingapplication.Repository.ShowRepo;
import com.lavish.moviebookingapplication.Repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class BookingService {

    @Autowired
    private BookingRepo bookingRepo;

    @Autowired
    private ShowRepo showRepo;

    @Autowired
    private UserRepo  userRepo;




    public Booking createBooking(Bookingdto bookingdto) {
        Show show = showRepo.findById(bookingdto.getShowId())
                .orElseThrow(()-> new RuntimeException("Show not found"));
        if(!isSeatsAvailable(show.getId(), bookingdto.getNumberOfSeats())){
            throw new RuntimeException("Seats not available");
        }
        if(bookingdto.getSeatNumbers().size() != bookingdto.getNumberOfSeats()){
            throw new RuntimeException("seat Numbers and Number of seats must be equal");
        }

        ValidateDuplicateSeats(show.getId(), bookingdto.getSeatNumbers());

        User user =  userRepo.findById(bookingdto.getUserId())
                .orElseThrow(()-> new RuntimeException("User not found"));

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setShow(show);
        booking.setBookingStatus(BookingStatus.PENDING);
        booking.setSeatNumbers(bookingdto.getSeatNumbers());
        booking.setBookingTime(LocalDateTime.now());
        booking.setPrice(CalculateTotalAmount(show.getPrice(), bookingdto.getNumberOfSeats()));
        booking.setNumberOfSeats(bookingdto.getNumberOfSeats());
        return bookingRepo.save(booking);

    }

    private Double CalculateTotalAmount(Double price, Integer numberOfSeats) {
        return price * numberOfSeats;
    }

    private void ValidateDuplicateSeats(Long id, List<String> seatNumbers) {
        Show show = showRepo.findById(id)
                .orElseThrow(()-> new RuntimeException("Show not found"));
        Set<String> occupiedSeats = show.getBookings().stream()
                .filter(b->b.getBookingStatus() != BookingStatus.CANCELLED)
                .flatMap(b->b.getSeatNumbers().stream())
                .collect(Collectors.toSet());
        
        for (String seat : seatNumbers) {
            if (occupiedSeats.contains(seat)) {
                throw new RuntimeException("Seat " + seat + " is already booked.");
            }
        }
    }

    private boolean isSeatsAvailable(Long showid, Integer numberOfSeats) {
        Show show = showRepo.findById(showid)
                .orElseThrow(()-> new RuntimeException("Show not found"));
        int bookedSeats = show.getBookings().stream()
                .filter(booking -> booking.getBookingStatus() != BookingStatus.CANCELLED)
                .mapToInt(Booking::getNumberOfSeats)
                .sum();
        return (show.getTheatre().getTheatreCapacity() - bookedSeats) >= numberOfSeats;
    }

    public List<Booking> getUserBooking(Long userid) {
        return bookingRepo.findByUserId(userid);
    }

    public List<Booking> getShowBooking(Long showid) {
        return bookingRepo.findByShowId(showid);
    }

    public Booking confirmBooking(Long bookingid) {
        Booking booking = bookingRepo.findById(bookingid)
                .orElseThrow(()-> new RuntimeException("Booking not found"));

        if(booking.getBookingStatus() != BookingStatus.PENDING){
            throw new RuntimeException("Booking status must be PENDING");
        }

        booking.setBookingStatus(BookingStatus.CONFIRMED);
        return bookingRepo.save(booking);

    }

    public Booking cancelBooking(Long id) {
        Booking booking = bookingRepo.findById(id)
                .orElseThrow(()-> new RuntimeException("Booking not found"));
        validateCancellation(booking);
        booking.setBookingStatus(BookingStatus.CANCELLED);
        return bookingRepo.save(booking);

    }

    private void validateCancellation(Booking booking) {
        LocalDateTime showTime = booking.getShow().getShowTime();
        LocalDateTime deadlineTime = showTime.minusHours(2);

        if(LocalDateTime.now().isAfter(deadlineTime)){
            throw new RuntimeException("cannot cancel the booking");
        }

        if(booking.getBookingStatus() == BookingStatus.CANCELLED){
            throw new RuntimeException("Booking already been cancelled");
        }
    }


    public List<Booking> getBookingByStatus(BookingStatus bookingStatus) {
        return bookingRepo.findByBookingStatus(bookingStatus);
    }
}
