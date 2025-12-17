package com.example.pharmacy.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {
    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender mailSender;

    public void sendOtpEmail(String to, String otp) {
        try {
            jakarta.mail.internet.MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(to);
            helper.setSubject("Password Reset OTP - Medix Pharma");
            helper.setText(
                "<h1>Medix Pharma</h1>" +
                "<p>You have requested to reset your password. Use the following OTP to proceed:</p>" +
                "<h2>" + otp + "</h2>" +
                "<p>This OTP is valid for 10 minutes. If you did not request this, please ignore this email.</p>",
                true
            );
            mailSender.send(message);
            logger.info("Password reset OTP email sent to: {}", to);
        } catch (jakarta.mail.MessagingException e) {
            logger.error("Failed to send OTP email to {}: {}", to, e.getMessage());
            throw new RuntimeException("Failed to send OTP email: " + e.getMessage());
        }
    }
}