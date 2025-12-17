package com.example.pharmacy.controller;

import com.example.pharmacy.dto.StockDTO;
import com.example.pharmacy.service.StockService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/stocks")
public class StockController {
    private static final Logger logger = LoggerFactory.getLogger(StockController.class);

    private final StockService stockService;

    @Autowired
    public StockController(StockService stockService) {
        this.stockService = stockService;
    }

    @GetMapping
    public ResponseEntity<List<StockDTO>> getAllStocks() {
        try {
            List<StockDTO> stocks = stockService.getAllStocks();
            return ResponseEntity.ok(stocks);
        } catch (Exception e) {
            logger.error("Error fetching all stocks: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<StockDTO> getStockById(@PathVariable Long id) {
        try {
            StockDTO stock = stockService.getStockById(id);
            return ResponseEntity.ok(stock);
        } catch (Exception e) {
            logger.error("Error fetching stock with ID {}: {}", id, e.getMessage(), e);
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/low-stock")
    public ResponseEntity<List<StockDTO>> getLowStock(@RequestParam int threshold) {
        try {
            List<StockDTO> lowStock = stockService.getLowStock(threshold);
            return ResponseEntity.ok(lowStock);
        } catch (Exception e) {
            logger.error("Error fetching low stock with threshold {}: {}", threshold, e.getMessage(), e);
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/expiring-soon")
    public ResponseEntity<List<StockDTO>> getExpiringSoon(@RequestParam String start, @RequestParam String end) {
        try {
            LocalDate startDate = LocalDate.parse(start);
            LocalDate endDate = LocalDate.parse(end);
            List<StockDTO> expiringStocks = stockService.getStockExpiringBetween(startDate, endDate);
            return ResponseEntity.ok(expiringStocks);
        } catch (Exception e) {
            logger.error("Error fetching expiring stock between {} and {}: {}", start, end, e.getMessage(), e);
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PostMapping
    public ResponseEntity<StockDTO> createStock(@RequestBody StockDTO stockDTO) {
        try {
            StockDTO createdStock = stockService.createStock(stockDTO);
            return ResponseEntity.ok(createdStock);
        } catch (Exception e) {
            logger.error("Error creating stock: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<StockDTO> updateStock(@PathVariable Long id, @RequestBody StockDTO stockDTO) {
        try {
            StockDTO updatedStock = stockService.updateStock(id, stockDTO);
            return ResponseEntity.ok(updatedStock);
        } catch (Exception e) {
            logger.error("Error updating stock with ID {}: {}", id, e.getMessage(), e);
            return ResponseEntity.badRequest().body(null);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStock(@PathVariable Long id) {
        try {
            stockService.deleteStock(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            logger.error("Error deleting stock with ID {}: {}", id, e.getMessage(), e);
            return ResponseEntity.badRequest().build();
        }
    }
}