package com.lavish.moviebookingapplication.Models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Data
public class Theatre {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String theatreName;
    private String theatreLocation;
    private Integer theatreCapacity;
    private String theatreScreenType;

    @OneToMany(mappedBy = "theatre", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Show> shows;



}
