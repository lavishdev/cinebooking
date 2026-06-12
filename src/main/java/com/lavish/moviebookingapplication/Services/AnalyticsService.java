package com.lavish.moviebookingapplication.Services;

import com.lavish.moviebookingapplication.DTOs.AnalyticsResponsedto;
import com.lavish.moviebookingapplication.Models.Booking;
import com.lavish.moviebookingapplication.Models.BookingStatus;
import com.lavish.moviebookingapplication.Repository.BookingRepo;
import com.lavish.moviebookingapplication.Repository.MovieRepo;
import com.lavish.moviebookingapplication.Repository.ShowRepo;
import com.lavish.moviebookingapplication.Repository.TheatreRepo;
import com.lavish.moviebookingapplication.Repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    @Autowired
    private BookingRepo bookingRepo;

    @Autowired
    private MovieRepo movieRepo;

    @Autowired
    private TheatreRepo theatreRepo;

    @Autowired
    private ShowRepo showRepo;

    @Autowired
    private UserRepo userRepo;

    public AnalyticsResponsedto getAnalytics() {
        List<Booking> allBookings = bookingRepo.findAll();
        List<Booking> confirmedBookings = allBookings.stream().filter(b -> b.getBookingStatus() == BookingStatus.CONFIRMED).collect(Collectors.toList());

        double totalRevenue = 0.0;
        double lostRevenue = 0.0;
        long totalSeatsSold = 0L;

        Map<String, Double> revenueByMovie = new HashMap<>();
        Map<String, Long> bookingStatusBreakdown = new HashMap<>();
        Map<String, Long> theatrePopularity = new HashMap<>();

        for (Booking booking : allBookings) {
            String status = booking.getBookingStatus() != null ? booking.getBookingStatus().name() : "UNKNOWN";
            bookingStatusBreakdown.put(status, bookingStatusBreakdown.getOrDefault(status, 0L) + 1);

            double price = booking.getPrice() != null ? booking.getPrice() : 0.0;

            if (booking.getBookingStatus() == BookingStatus.CANCELLED) {
                lostRevenue += price;
            } else if (booking.getBookingStatus() == BookingStatus.CONFIRMED) {
                totalRevenue += price;
                totalSeatsSold += booking.getNumberOfSeats() != null ? booking.getNumberOfSeats() : 0;

                String movieName = "Unknown Movie";
                String theatreName = "Unknown Theatre";
                if (booking.getShow() != null) {
                    if (booking.getShow().getMovie() != null) {
                        movieName = booking.getShow().getMovie().getName();
                    }
                    if (booking.getShow().getTheatre() != null) {
                        theatreName = booking.getShow().getTheatre().getTheatreName();
                    }
                }
                revenueByMovie.put(movieName, revenueByMovie.getOrDefault(movieName, 0.0) + price);
                theatrePopularity.put(theatreName, theatrePopularity.getOrDefault(theatreName, 0L) + 1);
            }
        }

        String mostPopularTheatre = "N/A";
        long maxTheatreCount = -1;
        for (Map.Entry<String, Long> entry : theatrePopularity.entrySet()) {
            if (entry.getValue() > maxTheatreCount) {
                maxTheatreCount = entry.getValue();
                mostPopularTheatre = entry.getKey();
            }
        }

        double averageRevenuePerBooking = confirmedBookings.isEmpty() ? 0.0 : totalRevenue / confirmedBookings.size();

        return AnalyticsResponsedto.builder()
                .totalRevenue(totalRevenue)
                .totalBookings((long) confirmedBookings.size())
                .totalMovies(movieRepo.count())
                .totalTheatres(theatreRepo.count())
                .totalShows(showRepo.count())
                .totalUsers(userRepo.count())
                .totalSeatsSold(totalSeatsSold)
                .lostRevenue(lostRevenue)
                .averageRevenuePerBooking(averageRevenuePerBooking)
                .mostPopularTheatre(mostPopularTheatre)
                .bookingStatusBreakdown(bookingStatusBreakdown)
                .revenueByMovie(revenueByMovie)
                .build();
    }
}
