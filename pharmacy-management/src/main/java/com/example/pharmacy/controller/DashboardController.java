package com.example.pharmacy.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {
    
    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public String adminDashboard() {
        return "Admin Dashboard Content";
    }
    
    @GetMapping("/pharmacist")
    @PreAuthorize("hasRole('PHARMACIST')")
    public String pharmacistDashboard() {
        return "Pharmacist Dashboard Content";
    }
    
    @GetMapping("/user-info")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PHARMACIST')")
    public String userInfo() {
        return "User Information Content";
    }
}