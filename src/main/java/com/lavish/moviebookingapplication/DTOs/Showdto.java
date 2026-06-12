package com.lavish.moviebookingapplication.DTOs;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class Showdto {
    private LocalDateTime showTime;
    private double price;
    private Long movieId;
    private Long theatreId;
}
