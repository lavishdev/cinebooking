package com.lavish.moviebookingapplication.Services;

import com.lavish.moviebookingapplication.DTOs.TheatreDto;
import com.lavish.moviebookingapplication.Models.Theatre;
import com.lavish.moviebookingapplication.Repository.TheatreRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TheatreService {

    @Autowired
    private TheatreRepo theatreRepo;

    public Object addTheatre(TheatreDto theatreDto) {
        Theatre theatre = new Theatre();
        theatre.setTheatreName(theatreDto.getTheatreName());
        theatre.setTheatreCapacity(theatreDto.getTheatreCapacity());
        theatre.setTheatreLocation(theatreDto.getTheatreLocation());
        theatre.setTheatreScreenType(theatreDto.getTheatreScreenType());
        return theatreRepo.save(theatre);
    }

    public Object getTheatreByLocation(String theatreLocation) {
        Optional<List<Theatre>> listofTheatrebox = theatreRepo.findByTheatreLocation(theatreLocation);

        if (listofTheatrebox.isPresent()) {
            return listofTheatrebox.get();
        }
        else throw new RuntimeException("No such theatre");
    }

    public Object updateTheatre(Long id, TheatreDto theatreDto) {
        Theatre theatre = theatreRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("No such theatre"));
        theatre.setTheatreName(theatreDto.getTheatreName());
        theatre.setTheatreCapacity(theatreDto.getTheatreCapacity());
        theatre.setTheatreLocation(theatreDto.getTheatreLocation());
        theatre.setTheatreScreenType(theatreDto.getTheatreScreenType());
        return theatreRepo.save(theatre);

    }

    public void deleteTheatre(Long id) {
        theatreRepo.deleteById(id);
    }
}
