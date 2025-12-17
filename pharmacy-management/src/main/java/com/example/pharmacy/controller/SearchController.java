package com.example.pharmacy.controller;

import com.example.pharmacy.dto.SearchResultDTO;
import com.example.pharmacy.service.SearchService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/search")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true") // Match SecurityConfig
public class SearchController {
    private static final Logger logger = LoggerFactory.getLogger(SearchController.class);

    @Autowired
    private SearchService searchService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ROLE_PHARMACIST', 'ROLE_STAFF')") // Require authentication
    public ResponseEntity<List<SearchResultDTO>> search(@RequestParam String query) {
        try {
            logger.info("Received search request with query: {}", query);
            if (query == null || query.trim().isEmpty()) {
                return ResponseEntity.ok(List.of());
            }
            List<SearchResultDTO> results = searchService.search(query);
            logger.info("Found {} search results", results.size());
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            logger.error("Error during search: {}", e.getMessage());
            return ResponseEntity.badRequest().body(List.of());
        }
    }
}