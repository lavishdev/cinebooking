package com.lavish.moviebookingapplication.Repository;

import com.lavish.moviebookingapplication.Models.Booking;
import com.lavish.moviebookingapplication.Models.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepo extends JpaRepository<Booking, Long> {

    List<Booking> findByUserId(Long userid);
    List<Booking> findByShowId(Long showid);
    List<Booking> findByBookingStatus(BookingStatus bookingStatus);

}