package com.example.pharmacy.service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Random;
import java.util.Set;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.pharmacy.controller.UserController.LoginRequest;
import com.example.pharmacy.entity.OtpVerification;
import com.example.pharmacy.entity.Role;
import com.example.pharmacy.entity.User;
import com.example.pharmacy.enums.ERole;
import com.example.pharmacy.repository.OtpVerificationRepository;
import com.example.pharmacy.repository.RoleRepository;
import com.example.pharmacy.repository.UserRepository;
@Service
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final OtpVerificationRepository otpVerificationRepository;
    private final JavaMailSender mailSender;
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);
    private final Map<String, OtpData> otpStorage = new HashMap<>();

    private static class OtpData {
        String otp;
        LocalDateTime expiry;
        String newPassword;

        OtpData(String otp, LocalDateTime expiry) {
            this.otp = otp;
            this.expiry = expiry;
        }
    }


    @Autowired
    public UserService(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder,
                       OtpVerificationRepository otpVerificationRepository, JavaMailSender mailSender) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.otpVerificationRepository = otpVerificationRepository;
        this.mailSender = mailSender;
    }

    @Autowired
    private EmailService emailService;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    @Transactional
    public User updateUser(User user) {
        if (!userRepository.existsById(user.getId())) {
            throw new RuntimeException("User not found with id: " + user.getId());
        }

        User existingUser = userRepository.findById(user.getId())
                .orElseThrow(() -> new RuntimeException("User not found with id: " + user.getId()));

        // Update only allowed fields
        existingUser.setFullName(user.getFullName());
        existingUser.setUsername(user.getUsername());
        existingUser.setEmail(user.getEmail());
        existingUser.setPhoneNumber(user.getPhoneNumber());

        return userRepository.save(existingUser);
    }

    @Transactional
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }

    @Transactional
    public void changePassword(Long userId, String currentPassword, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    @Transactional
    public User updateUserRole(Long userId, String roleName) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        // Convert string role to ERole enum
        ERole roleEnum;
        try {
            roleEnum = ERole.valueOf(roleName.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid role: " + roleName);
        }

        // Find the role in the database
        Role role = roleRepository.findByName(roleEnum)
                .orElseThrow(() -> new RuntimeException("Role not found: " + roleName));

        // Update user's roles
        Set<Role> roles = new HashSet<>();
        roles.add(role);
        user.setRoles(roles);

        return userRepository.save(user);
    }

    @Transactional
    public User createUser(String username, String password, String email, String fullName, String phoneNumber, String roleName) {
        if (userRepository.existsByUsername(username)) {
            throw new RuntimeException("Username is already taken!");
        }
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email is already in use!");
        }

        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setEmail(email);
        user.setFullName(fullName);
        user.setPhoneNumber(phoneNumber);
        user.setActive(true);

        ERole roleEnum;
        try {
            roleEnum = ERole.valueOf(roleName.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid role: " + roleName);
        }

        Role role = roleRepository.findByName(roleEnum)
                .orElseThrow(() -> new RuntimeException("Role not found: " + roleName));

        Set<Role> roles = new HashSet<>();
        roles.add(role);
        user.setRoles(roles);

        return userRepository.save(user);
    }

    @Transactional
    public String generateAndSendOtp(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User with email " + email + " not found");
        }

        // Generate 6-digit OTP
        String otp = String.format("%06d", new Random().nextInt(999999));
        LocalDateTime expiryTime = LocalDateTime.now().plusMinutes(10); // OTP valid for 10 minutes

        // Clean up existing OTP records
        Optional<OtpVerification> existingOtp = otpVerificationRepository.findByEmail(email);
        if (existingOtp.isPresent()) {
            logger.info("Deleting existing OTP for email: " + email);
            otpVerificationRepository.deleteByEmail(email);
        }

        // Save new OTP
        logger.info("Saving new OTP for email: " + email);
        OtpVerification otpVerification = new OtpVerification(email, otp, expiryTime, false);
        otpVerificationRepository.save(otpVerification);

        // Send OTP via email
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Your OTP for Login");
        message.setText("Your OTP is: " + otp + ". It is valid for 10 minutes.");
        try {
            mailSender.send(message);
            logger.info("OTP email sent to: " + email);
        } catch (Exception e) {
            logger.error("Failed to send OTP email: " + e.getMessage());
            throw new RuntimeException("Failed to send OTP email: " + e.getMessage());
        }

        return otp;
    }

    @Transactional
    public boolean verifyOtp(String email, String otp) {
        Optional<OtpVerification> otpOpt = otpVerificationRepository.findByEmailAndOtp(email, otp);
        if (otpOpt.isEmpty()) {
            logger.warn("No matching OTP found for email: " + email);
            return false;
        }

        OtpVerification otpVerification = otpOpt.get();
        if (LocalDateTime.now().isAfter(otpVerification.getExpiryTime()) || otpVerification.isVerified()) {
            logger.warn("OTP for email {} is expired or already verified", email);
            return false;
        }

        otpVerification.setVerified(true);
        otpVerificationRepository.save(otpVerification);
        otpVerificationRepository.deleteByEmail(email); // Clean up after verification
        logger.info("OTP verified successfully for email: " + email);
        return true;
    }

    @Transactional
    public String initiateLogin(LoginRequest request) {
        logger.info("Initiating login for email: {}", request.getEmail());
        // Validate email and password
        User user = loginWithPassword(request.getEmail(), request.getPassword());
        // Generate and send OTP
        generateAndSendOtp(user.getEmail());
        logger.info("OTP sent for email: {}", user.getEmail());
        return "OTP sent to " + user.getEmail();
    }

    @Transactional
    public User loginWithOtp(String email, String otp) {
        logger.info("Validating OTP for email: {}, OTP: {}", email, otp);
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
        if (!verifyOtp(email, otp)) {
            logger.error("Invalid OTP for email: {}", email);
            throw new RuntimeException("Invalid OTP");
        }
        logger.info("OTP validated successfully for email: {}", email);
        return user;
    }

    public User loginWithPassword(String email, String password) {
        logger.info("Attempting to validate email: {} with password", email);
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Invalid email or password"));
        logger.info("User found: {} with roles: {}", user.getEmail(), user.getRoles());
    
        if (!passwordEncoder.matches(password, user.getPassword())) {
            logger.error("Password mismatch for email: {}. Provided password: {}, stored hash: {}", email, password, user.getPassword());
            throw new RuntimeException("Invalid email or password");
        }
    
        // Validate role
        boolean hasValidRole = user.getRoles().stream()
            .anyMatch(role -> {
                boolean isValid = role.getName() == ERole.ROLE_PHARMACIST || role.getName() == ERole.ROLE_STAFF;
                logger.info("Checking role: {} - Valid: {}", role.getName(), isValid);
                return isValid;
            });
        if (!hasValidRole) {
            logger.error("User {} has no valid role for login. Roles: {}", email, user.getRoles());
            throw new RuntimeException("User does not have a valid role for login (must be ROLE_PHARMACIST or ROLE_STAFF)");
        }
    
        logger.info("Email and password validated successfully for email: {}", email);
        return user;
    }
    @Transactional(readOnly = true)
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }

    public void initiatePasswordReset(String email) {
        logger.info("Initiating password reset for email: {}", email);
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        String otp = generateOtp();
        LocalDateTime expiry = LocalDateTime.now().plusMinutes(10);
        otpStorage.put(email, new OtpData(otp, expiry));

        emailService.sendOtpEmail(email, otp);
    }

    public void resetPassword(String email, String otp, String newPassword) {
        logger.info("Resetting password for email: {}", email);
        OtpData otpData = otpStorage.get(email);
        if (otpData == null) {
            throw new RuntimeException("No OTP found for email: " + email);
        }

        if (LocalDateTime.now().isAfter(otpData.expiry)) {
            otpStorage.remove(email);
            throw new RuntimeException("OTP has expired");
        }

        if (!otpData.otp.equals(otp)) {
            throw new RuntimeException("Invalid OTP");
        }

        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        otpStorage.remove(email);
        logger.info("Password reset successful for email: {}", email);
    }

    private String generateOtp() {
        return String.format("%06d", new Random().nextInt(999999));
    }

}