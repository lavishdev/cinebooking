package com.lavish.moviebookingapplication.Services;

import com.lavish.moviebookingapplication.Models.Otp;
import com.lavish.moviebookingapplication.Repository.OtpRepo;
import org.springframework.beans.factory.annotation.Autowired;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
public class OtpService {

    @Autowired
    private OtpRepo otpRepo;

    @Autowired(required = false)
    private JavaMailSender mailSender;

    public void generateAndSendOtp(String email) {
        // Delete any existing OTP for this email
        Optional<Otp> existingOtp = otpRepo.findByEmail(email);
        existingOtp.ifPresent(otp -> otpRepo.delete(otp));

        // Generate a 6-digit OTP
        String otpCode = String.format("%06d", new Random().nextInt(999999));

        Otp otp = new Otp();
        otp.setEmail(email);
        otp.setOtpCode(otpCode);
        otp.setExpiryTime(LocalDateTime.now().plusMinutes(10));

        otpRepo.save(otp);

        // Print to console for easy testing
        System.out.println("=================================================");
        System.out.println("OTP CODE FOR " + email + " IS: " + otpCode);
        System.out.println("=================================================");

        // Actually send the email if JavaMailSender is configured
        if (mailSender != null) {
            try {
                MimeMessage message = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
                
                helper.setTo(email);
                helper.setSubject("Your CineBooking Verification OTP");
                helper.setFrom("noreply@cinebooking.com");
                
                String htmlContent = "<div style=\"font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #0f1115; color: #ffffff; border-radius: 10px;\">" +
                        "<div style=\"text-align: center; margin-bottom: 30px;\">" +
                        "<h1 style=\"color: #e50914; margin: 0; font-size: 28px; letter-spacing: 2px;\">CineBooking</h1>" +
                        "</div>" +
                        "<div style=\"background-color: #1a1d24; padding: 30px; border-radius: 8px; border: 1px solid #2a2d35;\">" +
                        "<h2 style=\"color: #ffffff; margin-top: 0;\">Verify your email address</h2>" +
                        "<p style=\"color: #a0a5b1; font-size: 16px; line-height: 1.5;\">Welcome to CineBooking! Please use the following 6-digit verification code to complete your sign in process.</p>" +
                        "<div style=\"background-color: #0f1115; padding: 20px; border-radius: 6px; text-align: center; margin: 30px 0; border: 1px dashed #e50914;\">" +
                        "<span style=\"font-size: 36px; font-weight: bold; letter-spacing: 12px; color: #ffffff;\">" + otpCode + "</span>" +
                        "</div>" +
                        "<p style=\"color: #a0a5b1; font-size: 14px; margin-bottom: 0;\">This code will expire in <strong style=\"color: #e50914;\">10 minutes</strong>. If you did not request this code, please ignore this email.</p>" +
                        "</div>" +
                        "<div style=\"text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px;\">" +
                        "<p>&copy; " + java.time.Year.now().getValue() + " CineBooking. All rights reserved.</p>" +
                        "</div>" +
                        "</div>";
                
                helper.setText(htmlContent, true);
                
                mailSender.send(message);
                System.out.println("Email sent successfully to: " + email);
            } catch (Exception e) {
                System.err.println("Failed to send email to " + email + ". Check application.properties SMTP config.");
                e.printStackTrace();
            }
        } else {
            System.out.println("JavaMailSender is not configured. Email not sent.");
        }
    }

    public boolean verifyOtp(String email, String otpCode) {
        Optional<Otp> otpOptional = otpRepo.findByEmail(email);
        
        if (otpOptional.isPresent()) {
            Otp otp = otpOptional.get();
            if (otp.getOtpCode().equals(otpCode)) {
                if (otp.getExpiryTime().isAfter(LocalDateTime.now())) {
                    // Valid OTP, delete it so it can't be reused
                    otpRepo.delete(otp);
                    return true;
                }
            }
        }
        return false;
    }
}
