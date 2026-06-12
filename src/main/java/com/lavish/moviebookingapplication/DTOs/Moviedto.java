package com.lavish.moviebookingapplication.DTOs;

import lombok.Data;

import java.time.LocalDate;
@Data
public class Moviedto {
    private String name;
    private String description;
    private String genre;
    private String language;
    private LocalDate releaseDate;
    private Integer duration;
}
