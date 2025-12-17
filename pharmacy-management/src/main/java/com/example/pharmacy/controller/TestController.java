package com.example.pharmacy.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/test")
public class TestController {
    
    @GetMapping("/public")
    public String publicEndpoint() {
        return "This is a public endpoint - no authentication required!";
    }
    
    @GetMapping("/public/hello")
    public String helloWorld() {
        return "Hello World! This endpoint is public.";
    }
    
    @GetMapping("/public/status")
    public String status() {
        return "API is running and accessible without authentication";
    }
} 