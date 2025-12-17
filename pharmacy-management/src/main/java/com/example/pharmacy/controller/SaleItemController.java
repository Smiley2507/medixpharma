package com.example.pharmacy.controller;

import com.example.pharmacy.dto.SaleItemDTO;
import com.example.pharmacy.service.SaleItemService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/sale-items")
@CrossOrigin(origins = "http://localhost:5173")
public class SaleItemController {
    private static final Logger logger = LoggerFactory.getLogger(SaleItemController.class);

    private final SaleItemService saleItemService;

    @Autowired
    public SaleItemController(SaleItemService saleItemService) {
        this.saleItemService = saleItemService;
    }

    @GetMapping
    public ResponseEntity<?> getAllSaleItems() {
        try {
            logger.info("Fetching all sale items");
            return ResponseEntity.ok(saleItemService.getAllSaleItems());
        } catch (RuntimeException e) {
            logger.error("Error fetching sale items: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            logger.error("Error fetching sale items: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body(Map.of("error", "Error fetching sale items: " + e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> createSaleItem(@RequestBody SaleItemDTO saleItemDTO) {
        try {
            logger.info("Creating sale item for product ID: {}", saleItemDTO.getProductId());
            SaleItemDTO createdSaleItem = saleItemService.createSaleItem(saleItemDTO);
            return ResponseEntity.ok(createdSaleItem);
        } catch (RuntimeException e) {
            logger.error("Error creating sale item: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            logger.error("Error creating sale item: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body(Map.of("error", "Error creating sale item: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getSaleItemById(@PathVariable Long id) {
        try {
            logger.info("Fetching sale item with ID: {}", id);
            return ResponseEntity.ok(saleItemService.getSaleItemById(id));
        } catch (RuntimeException e) {
            logger.error("Error fetching sale item: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            logger.error("Error fetching sale item: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body(Map.of("error", "Error fetching sale item: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateSaleItem(@PathVariable Long id, @RequestBody SaleItemDTO saleItemDTO) {
        try {
            logger.info("Updating sale item with ID: {}", id);
            SaleItemDTO updatedSaleItem = saleItemService.updateSaleItem(id, saleItemDTO);
            return ResponseEntity.ok(updatedSaleItem);
        } catch (RuntimeException e) {
            logger.error("Error updating sale item: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            logger.error("Error updating sale item: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body(Map.of("error", "Error updating sale item: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSaleItem(@PathVariable Long id) {
        try {
            logger.info("Deleting sale item with ID: {}", id);
            saleItemService.deleteSaleItem(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            logger.error("Error deleting sale item: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            logger.error("Error deleting sale item: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body(Map.of("error", "Error deleting sale item: " + e.getMessage()));
        }
    }
}