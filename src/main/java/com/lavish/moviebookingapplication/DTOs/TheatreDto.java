package com.lavish.moviebookingapplication.DTOs;

import lombok.Data;

@Data
public class TheatreDto {
    private String theatreName;
    private String theatreLocation;
    private Integer theatreCapacity;
    private String theatreScreenType;
}
