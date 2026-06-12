package com.lavish.moviebookingapplication.DTOs;

import lombok.Builder;
import lombok.Data;

@Data

public class LoginRequestdto {
    private String username;
    private String password;
}
