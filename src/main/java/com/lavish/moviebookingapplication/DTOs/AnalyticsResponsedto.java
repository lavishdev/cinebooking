package com.lavish.moviebookingapplication.DTOs;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsResponsedto {
    private Double totalRevenue;
    private Long totalBookings;
    private Long totalMovies;
    private Long totalTheatres;
    private Long totalShows;
    private Long totalUsers;
    private Long totalSeatsSold;
    private Double lostRevenue;
    private Double averageRevenuePerBooking;
    private String mostPopularTheatre;
    private Map<String, Long> bookingStatusBreakdown;
    private Map<String, Double> revenueByMovie;
}
