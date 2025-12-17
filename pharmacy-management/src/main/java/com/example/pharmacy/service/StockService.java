package com.example.pharmacy.service;

import com.example.pharmacy.dto.StockDTO;
import com.example.pharmacy.entity.Product;
import com.example.pharmacy.entity.Stock;
import com.example.pharmacy.repository.ProductRepository;
import com.example.pharmacy.repository.StockRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class StockService {
    private static final Logger logger = LoggerFactory.getLogger(StockService.class);

    private final StockRepository stockRepository;
    private final ProductRepository productRepository;

    @Autowired
    public StockService(StockRepository stockRepository, ProductRepository productRepository) {
        this.stockRepository = stockRepository;
        this.productRepository = productRepository;
    }

    // Helper method to convert Stock to StockDTO
    private StockDTO convertToDTO(Stock stock) {
        StockDTO dto = new StockDTO();
        dto.setStockId(stock.getStockId());
        dto.setProductId(stock.getProduct() != null ? stock.getProduct().getProductId() : null);
        dto.setProductName(stock.getProduct() != null ? stock.getProduct().getName() : "Unknown");
        dto.setBatchNumber(stock.getBatchNumber());
        dto.setQuantity(stock.getQuantity());
        dto.setExpiryDate(stock.getExpiryDate());
        return dto;
    }

    @Transactional
    public StockDTO createStock(StockDTO stockDTO) {
        try {
            logger.info("Starting stock creation for product ID: {}", stockDTO.getProductId());

            // Validate required fields
            if (stockDTO.getProductId() == null) {
                throw new RuntimeException("Product ID is required");
            }
            if (stockDTO.getQuantity() == null || stockDTO.getQuantity() <= 0) {
                throw new RuntimeException("Quantity must be greater than 0");
            }

            // Fetch the product from the database
            Product product = productRepository.findById(stockDTO.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found with ID: " + stockDTO.getProductId()));

            // Create the stock entity
            Stock stock = new Stock();
            stock.setProduct(product);
            stock.setBatchNumber(stockDTO.getBatchNumber());
            stock.setQuantity(stockDTO.getQuantity());
            stock.setExpiryDate(stockDTO.getExpiryDate());

            Stock savedStock = stockRepository.save(stock);
            return convertToDTO(savedStock);
        } catch (Exception e) {
            logger.error("Error creating stock: {}", e.getMessage(), e);
            throw new RuntimeException("Error creating stock: " + e.getMessage(), e);
        }
    }

    @Transactional
    public StockDTO updateStock(Long id, StockDTO stockDTO) {
        try {
            logger.info("Starting stock update for ID: {}", id);

            Stock stock = stockRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Stock not found with ID: " + id));

            // Validate required fields
            if (stockDTO.getProductId() == null) {
                throw new RuntimeException("Product ID is required");
            }
            if (stockDTO.getQuantity() == null || stockDTO.getQuantity() <= 0) {
                throw new RuntimeException("Quantity must be greater than 0");
            }

            // Fetch the product
            Product product = productRepository.findById(stockDTO.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found with ID: " + stockDTO.getProductId()));

            // Update stock fields
            stock.setProduct(product);
            stock.setBatchNumber(stockDTO.getBatchNumber());
            stock.setQuantity(stockDTO.getQuantity());
            stock.setExpiryDate(stockDTO.getExpiryDate());

            Stock updatedStock = stockRepository.save(stock);
            return convertToDTO(updatedStock);
        } catch (Exception e) {
            logger.error("Error updating stock: {}", e.getMessage(), e);
            throw new RuntimeException("Error updating stock: " + e.getMessage(), e);
        }
    }

    public List<StockDTO> getAllStocks() {
        try {
            List<Stock> stocks = stockRepository.findAll();
            return stocks.stream().map(this::convertToDTO).collect(Collectors.toList());
        } catch (Exception e) {
            logger.error("Error fetching all stocks: {}", e.getMessage(), e);
            throw new RuntimeException("Error fetching all stocks: " + e.getMessage(), e);
        }
    }

    public StockDTO getStockById(Long id) {
        try {
            Stock stock = stockRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Stock not found with ID: " + id));
            return convertToDTO(stock);
        } catch (Exception e) {
            logger.error("Error fetching stock by ID: {}", e.getMessage(), e);
            throw new RuntimeException("Error fetching stock by ID: " + e.getMessage(), e);
        }
    }

    public List<StockDTO> getStockByProduct(Product product) {
        try {
            List<Stock> stocks = stockRepository.findByProduct(product);
            return stocks.stream().map(this::convertToDTO).collect(Collectors.toList());
        } catch (Exception e) {
            logger.error("Error fetching stock by product: {}", e.getMessage(), e);
            throw new RuntimeException("Error fetching stock by product: " + e.getMessage(), e);
        }
    }

    public List<StockDTO> getStockByBatchNumber(String batchNumber) {
        try {
            List<Stock> stocks = stockRepository.findByBatchNumber(batchNumber);
            return stocks.stream().map(this::convertToDTO).collect(Collectors.toList());
        } catch (Exception e) {
            logger.error("Error fetching stock by batch number: {}", e.getMessage(), e);
            throw new RuntimeException("Error fetching stock by batch number: " + e.getMessage(), e);
        }
    }

    public List<StockDTO> getExpiredStock(LocalDate date) {
        try {
            List<Stock> stocks = stockRepository.findByExpiryDateBefore(date);
            return stocks.stream().map(this::convertToDTO).collect(Collectors.toList());
        } catch (Exception e) {
            logger.error("Error fetching expired stock: {}", e.getMessage(), e);
            throw new RuntimeException("Error fetching expired stock: " + e.getMessage(), e);
        }
    }

    public List<StockDTO> getStockExpiringBetween(LocalDate start, LocalDate end) {
        try {
            List<Stock> stocks = stockRepository.findByExpiryDateBetween(start, end);
            return stocks.stream().map(this::convertToDTO).collect(Collectors.toList());
        } catch (Exception e) {
            logger.error("Error fetching stock expiring between {} and {}: {}", start, end, e.getMessage(), e);
            throw new RuntimeException("Error fetching stock expiring between dates: " + e.getMessage(), e);
        }
    }

    public List<StockDTO> getLowStock(Integer threshold) {
        try {
            List<Stock> stocks = stockRepository.findByQuantityLessThanEqual(threshold);
            return stocks.stream().map(this::convertToDTO).collect(Collectors.toList());
        } catch (Exception e) {
            logger.error("Error fetching low stock with threshold {}: {}", threshold, e.getMessage(), e);
            throw new RuntimeException("Error fetching low stock: " + e.getMessage(), e);
        }
    }

    public Integer getTotalQuantityForProduct(Long productId) {
        try {
            return stockRepository.getTotalQuantity(productId);
        } catch (Exception e) {
            logger.error("Error fetching total quantity for product ID {}: {}", productId, e.getMessage(), e);
            throw new RuntimeException("Error fetching total quantity for product: " + e.getMessage(), e);
        }
    }

    @Transactional
    public void deleteStock(Long id) {
        try {
            if (!stockRepository.existsById(id)) {
                throw new RuntimeException("Stock not found with ID: " + id);
            }
            stockRepository.deleteById(id);
            logger.info("Successfully deleted stock with ID: {}", id);
        } catch (Exception e) {
            logger.error("Error deleting stock: {}", e.getMessage(), e);
            throw new RuntimeException("Error deleting stock: " + e.getMessage(), e);
        }
    }
}