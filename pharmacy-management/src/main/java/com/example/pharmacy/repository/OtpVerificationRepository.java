// com.example.pharmacy.repository/OtpVerificationRepository.java
package com.example.pharmacy.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.pharmacy.entity.OtpVerification;

import java.util.Optional;

public interface OtpVerificationRepository extends JpaRepository<OtpVerification, Long> {
    Optional<OtpVerification> findByEmailAndOtp(String email, String otp);
    Optional<OtpVerification> findByEmail(String email);
    void deleteByEmail(String email);
}