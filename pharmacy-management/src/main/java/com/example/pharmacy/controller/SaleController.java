package com.example.pharmacy.controller;

import com.example.pharmacy.dto.SaleDTO;
import com.example.pharmacy.service.SaleService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sales")
@CrossOrigin(origins = "http://localhost:5173")
public class SaleController {
    private static final Logger logger = LoggerFactory.getLogger(SaleController.class);

    private final SaleService saleService;

    @Autowired
    public SaleController(SaleService saleService) {
        this.saleService = saleService;
    }

    @GetMapping
    public ResponseEntity<?> getAllSales() {
        try {
            logger.info("Fetching all sales");
            return ResponseEntity.ok(saleService.getAllSales());
        } catch (RuntimeException e) {
            logger.error("Error fetching sales: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            logger.error("Error fetching sales: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body(Map.of("error", "Error fetching sales: " + e.getMessage()));
        }
    }



    @GetMapping("/date-range")
    public ResponseEntity<List<SaleDTO>> getSalesByDateRange(
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {
        try {
            logger.info("Fetching sales between {} and {}", start, end);
            List<SaleDTO> sales = saleService.getSalesBetweenDates(start, end);
            return ResponseEntity.ok(sales);
        } catch (Exception e) {
            logger.error("Error fetching sales between {} and {}: {}", start, end, e.getMessage(), e);
            return ResponseEntity.badRequest().body(null);
        }
    }
    @PostMapping
    public ResponseEntity<?> createSale(@RequestBody SaleDTO saleDTO) {
        try {
            logger.info("Creating sale for customer: {}", saleDTO.getCustomerName());
            return ResponseEntity.ok(saleService.processSale(saleDTO));
        } catch (RuntimeException e) {
            logger.error("Error creating sale: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            logger.error("Error creating sale: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body(Map.of("error", "Error creating sale: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getSaleById(@PathVariable Long id) {
        try {
            logger.info("Fetching sale with ID: {}", id);
            return ResponseEntity.ok(saleService.getSaleById(id));
        } catch (RuntimeException e) {
            logger.error("Error fetching sale: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            logger.error("Error fetching sale: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body(Map.of("error", "Error fetching sale: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateSale(@PathVariable Long id, @RequestBody SaleDTO saleDTO) {
        try {
            logger.info("Updating sale with ID: {}", id);
            return ResponseEntity.ok(saleService.updateSale(id, saleDTO));
        } catch (RuntimeException e) {
            logger.error("Error updating sale: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            logger.error("Error updating sale: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body(Map.of("error", "Error updating sale: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSale(@PathVariable Long id) {
        try {
            logger.info("Deleting sale with ID: {}", id);
            saleService.deleteSale(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            logger.error("Error deleting sale: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            logger.error("Error deleting sale: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body(Map.of("error", "Error deleting sale: " + e.getMessage()));
        }
    }
}