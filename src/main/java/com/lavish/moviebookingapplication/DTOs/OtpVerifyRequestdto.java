package com.lavish.moviebookingapplication.DTOs;

import lombok.Data;

@Data
public class OtpVerifyRequestdto {
    private String username;
    private String otpCode;
}
