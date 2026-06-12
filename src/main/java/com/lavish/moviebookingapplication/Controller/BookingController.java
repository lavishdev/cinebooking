package com.lavish.moviebookingapplication.Controller;

import com.lavish.moviebookingapplication.DTOs.Bookingdto;
import com.lavish.moviebookingapplication.Models.Booking;
import com.lavish.moviebookingapplication.Models.BookingStatus;
import com.lavish.moviebookingapplication.Services.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/booking")
public class BookingController {
    @Autowired
    private BookingService bookingService;

    @PostMapping("/createbooking")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<Booking> createBooking(@RequestBody Bookingdto  bookingdto) {
        return ResponseEntity.ok(bookingService.createBooking(bookingdto));
    }

    @GetMapping("/getuserbooking/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<List<Booking>> getUserBookings(@PathVariable Long id){
        return ResponseEntity.ok(bookingService.getUserBooking(id));
    }

    @GetMapping("/getshowbooking/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Booking>> getShowBookings(@PathVariable Long id){
        return ResponseEntity.ok(bookingService.getShowBooking(id));
    }

    @PutMapping("{id}/confirm")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Booking> confirmBooking(@PathVariable Long id){
        return ResponseEntity.ok(bookingService.confirmBooking(id));
    }

    @PutMapping("{id}/cancel")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<Booking> cancelBooking(@PathVariable Long id){
        return ResponseEntity.ok(bookingService.cancelBooking(id));
    }

    @GetMapping("/getbookingbystatus/{bookingStatus}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Booking>> getBookingByStatus(@PathVariable BookingStatus bookingStatus){
        return  ResponseEntity.ok(bookingService.getBookingByStatus(bookingStatus));
    }
}

