package com.example.pharmacy.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.pharmacy.dto.SaleDTO;
import com.example.pharmacy.dto.SaleItemDTO;
import com.example.pharmacy.dto.StockDTO;
import com.example.pharmacy.entity.Product;
import com.example.pharmacy.entity.Sale;
import com.example.pharmacy.entity.SaleItem;
import com.example.pharmacy.repository.ProductRepository;
import com.example.pharmacy.repository.SaleItemRepository;
import com.example.pharmacy.repository.SaleRepository;
import com.example.pharmacy.repository.StockRepository;

import jakarta.transaction.Transactional;

@Service
public class SaleService {
    private static final Logger logger = LoggerFactory.getLogger(SaleService.class);

    private final SaleRepository saleRepository;
    private final StockService stockService;
    private final ProductRepository productRepository;
    private final StockRepository stockRepository;
    private final SaleItemRepository saleItemRepository;

    @Autowired
    public SaleService(SaleRepository saleRepository, StockService stockService, ProductRepository productRepository, 
                       StockRepository stockRepository, SaleItemRepository saleItemRepository) {
        this.saleRepository = saleRepository;
        this.stockService = stockService;
        this.productRepository = productRepository;
        this.stockRepository = stockRepository;
        this.saleItemRepository = saleItemRepository;
    }

    // Convert Sale to SaleDTO
    private SaleDTO convertToDTO(Sale sale) {
        SaleDTO dto = new SaleDTO();
        dto.setSaleId(sale.getSaleId());
        dto.setCustomerName(sale.getCustomerName());
        dto.setSaleDate(sale.getSaleDate());
        dto.setTotalAmount(sale.getTotalAmount());
        dto.setPaymentMethod(sale.getPaymentMethod());
        List<SaleItemDTO> saleItemDTOs = sale.getSaleItems().stream().map(saleItem -> {
            SaleItemDTO itemDTO = new SaleItemDTO();
            itemDTO.setSaleItemId(saleItem.getSaleItemId());
            itemDTO.setProductId(saleItem.getProduct() != null ? saleItem.getProduct().getProductId() : null);
            itemDTO.setProductName(saleItem.getProduct() != null ? saleItem.getProduct().getName() : "Unknown");
            itemDTO.setQuantity(saleItem.getQuantity());
            itemDTO.setUnitPrice(saleItem.getUnitPrice());
            itemDTO.setTotalPrice(saleItem.getTotalPrice());
            return itemDTO;
        }).collect(Collectors.toList());
        dto.setSaleItems(saleItemDTOs);
        return dto;
    }

    public List<SaleDTO> getAllSales() {
        try {
            List<Sale> sales = saleRepository.findAll();
            return sales.stream().map(this::convertToDTO).collect(Collectors.toList());
        } catch (Exception e) {
            logger.error("Error fetching all sales: {}", e.getMessage(), e);
            throw new RuntimeException("Error fetching all sales: " + e.getMessage(), e);
        }
    }

    public Optional<SaleDTO> getSaleById(Long id) {
        try {
            Optional<Sale> sale = saleRepository.findById(id);
            return sale.map(this::convertToDTO);
        } catch (Exception e) {
            logger.error("Error fetching sale by ID {}: {}", id, e.getMessage(), e);
            throw new RuntimeException("Error fetching sale by ID: " + e.getMessage(), e);
        }
    }

    public List<SaleDTO> getSalesByDate(LocalDate date) {
        try {
            List<Sale> sales = saleRepository.findBySaleDate(date);
            return sales.stream().map(this::convertToDTO).collect(Collectors.toList());
        } catch (Exception e) {
            logger.error("Error fetching sales by date {}: {}", date, e.getMessage(), e);
            throw new RuntimeException("Error fetching sales by date: " + e.getMessage(), e);
        }
    }

    public List<SaleDTO> getSalesBetweenDates(LocalDate startDate, LocalDate endDate) {
        try {
            List<Sale> sales = saleRepository.findBySaleDateBetween(startDate, endDate);
            return sales.stream().map(this::convertToDTO).collect(Collectors.toList());
        } catch (Exception e) {
            logger.error("Error fetching sales between {} and {}: {}", startDate, endDate, e.getMessage(), e);
            throw new RuntimeException("Error fetching sales between dates: " + e.getMessage(), e);
        }
    }

    public List<SaleDTO> getSalesByCustomer(String customerName) {
        try {
            List<Sale> sales = saleRepository.findByCustomerName(customerName);
            return sales.stream().map(this::convertToDTO).collect(Collectors.toList());
        } catch (Exception e) {
            logger.error("Error fetching sales by customer {}: {}", customerName, e.getMessage(), e);
            throw new RuntimeException("Error fetching sales by customer: " + e.getMessage(), e);
        }
    }

    @Transactional
public SaleDTO processSale(SaleDTO saleDTO) {
    try {
        logger.info("Processing sale for customer: {}", saleDTO.getCustomerName());

        if (saleDTO.getSaleItems() == null || saleDTO.getSaleItems().isEmpty()) {
            throw new RuntimeException("Sale must include at least one sale item");
        }

        Sale sale = new Sale();
        sale.setCustomerName(saleDTO.getCustomerName());
        sale.setSaleDate(saleDTO.getSaleDate() != null ? saleDTO.getSaleDate() : LocalDate.now());
        sale.setTotalAmount(saleDTO.getTotalAmount() != null ? saleDTO.getTotalAmount() : BigDecimal.ZERO);
        sale.setPaymentMethod(saleDTO.getPaymentMethod());

        List<SaleItem> saleItems = saleDTO.getSaleItems().stream().map(saleItemDTO -> {
            SaleItem saleItem = new SaleItem();
            saleItem.setSaleItemId(saleItemDTO.getSaleItemId());
            if (saleItemDTO.getProductId() == null) {
                throw new RuntimeException("Product ID is required for sale item");
            }
            Product product = productRepository.findById(saleItemDTO.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found with ID: " + saleItemDTO.getProductId()));
            saleItem.setProduct(product);
            saleItem.setQuantity(saleItemDTO.getQuantity());
            saleItem.setUnitPrice(saleItemDTO.getUnitPrice());
            saleItem.setTotalPrice(saleItemDTO.getTotalPrice());
            saleItem.setSale(sale);
            return saleItem;
        }).toList();

        sale.setSaleItems(saleItems);

        BigDecimal totalAmount = BigDecimal.ZERO;
        for (SaleItem item : sale.getSaleItems()) {
            if (item.getQuantity() == null || item.getQuantity() <= 0) {
                throw new RuntimeException("Quantity must be greater than 0 for product: " + item.getProduct().getName());
            }
            if (item.getUnitPrice() == null || item.getUnitPrice().compareTo(BigDecimal.ZERO) <= 0) {
                throw new RuntimeException("Unit price must be greater than 0 for product: " + item.getProduct().getName());
            }
            BigDecimal itemTotal = item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
            item.setTotalPrice(itemTotal);
            totalAmount = totalAmount.add(itemTotal);
            updateStockAfterSale(item);
        }
        
        sale.setTotalAmount(totalAmount);
        Sale savedSale = saleRepository.save(sale); // Ensure save is called
        logger.info("Successfully processed sale with ID: {}", savedSale.getSaleId());
        return convertToDTO(savedSale);
    } catch (Exception e) {
        logger.error("Error processing sale: {}", e.getMessage(), e);
        throw new RuntimeException("Error processing sale: " + e.getMessage());
    }
}

    @Transactional
    public SaleDTO updateSale(Long saleId, SaleDTO saleDTO) {
        try {
            logger.info("Updating sale with ID: {}", saleId);

            // Fetch existing sale
            Sale sale = saleRepository.findById(saleId)
                .orElseThrow(() -> new RuntimeException("Sale not found with ID: " + saleId));

            // Update sale details
            sale.setCustomerName(saleDTO.getCustomerName());
            sale.setSaleDate(saleDTO.getSaleDate());
            sale.setPaymentMethod(saleDTO.getPaymentMethod());

            // Handle sale items
            if (saleDTO.getSaleItems() != null) {
                // Map existing sale items and update or add new ones
                List<SaleItem> existingSaleItems = sale.getSaleItems();
                List<SaleItemDTO> updatedSaleItems = saleDTO.getSaleItems();

                // Update existing sale items
                for (SaleItemDTO updatedItem : updatedSaleItems) {
                    if (updatedItem.getSaleItemId() == null) {
                        throw new RuntimeException("Sale item ID is required for update");
                    }
                    SaleItem saleItem = existingSaleItems.stream()
                        .filter(item -> item.getSaleItemId().equals(updatedItem.getSaleItemId()))
                        .findFirst()
                        .orElseThrow(() -> new RuntimeException("Sale item not found with ID: " + updatedItem.getSaleItemId()));

                    // Fetch product if productId is provided (for validation)
                    if (updatedItem.getProductId() != null) {
                        Product product = productRepository.findById(updatedItem.getProductId())
                            .orElseThrow(() -> new RuntimeException("Product not found with ID: " + updatedItem.getProductId()));
                        saleItem.setProduct(product);
                    }

                    // Update quantities and prices
                    int oldQuantity = saleItem.getQuantity();
                    saleItem.setQuantity(updatedItem.getQuantity());
                    saleItem.setUnitPrice(updatedItem.getUnitPrice());
                    saleItem.setTotalPrice(updatedItem.getUnitPrice().multiply(BigDecimal.valueOf(updatedItem.getQuantity())));

                    // Adjust stock based on quantity change
                    int quantityChange = updatedItem.getQuantity() - oldQuantity;
                    if (quantityChange != 0) {
                        adjustStockAfterUpdate(saleItem, quantityChange);
                    }
                }

                // Recalculate total amount
                BigDecimal totalAmount = sale.getSaleItems().stream()
                    .map(SaleItem::getTotalPrice)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
                sale.setTotalAmount(totalAmount);
            }

            Sale updatedSale = saleRepository.save(sale);
            logger.info("Successfully updated sale with ID: {}", updatedSale.getSaleId());
            return convertToDTO(updatedSale);
        } catch (Exception e) {
            logger.error("Error updating sale: {}", e.getMessage(), e);
            throw new RuntimeException("Error updating sale: " + e.getMessage());
        }
    }

    private void updateStockAfterSale(SaleItem saleItem) {
        logger.info("Updating stock for product ID: {} (Name: {}) with requested quantity: {}", 
            saleItem.getProduct().getProductId(), saleItem.getProduct().getName(), saleItem.getQuantity());
        
        // Use getTotalQuantity for initial check
        Integer totalAvailableStock = stockRepository.getTotalQuantity(saleItem.getProduct().getProductId());
        logger.info("Total available stock for product ID: {} is {}", saleItem.getProduct().getProductId(), totalAvailableStock);

        if (totalAvailableStock == null || totalAvailableStock < saleItem.getQuantity()) {
            throw new RuntimeException("Insufficient stock for product: " + saleItem.getProduct().getName() +
                ". Available: " + (totalAvailableStock != null ? totalAvailableStock : 0) + ", Requested: " + saleItem.getQuantity());
        }
        
        // Proceed with stock reduction using the list of stocks
        List<StockDTO> stocks = stockService.getStockByProduct(saleItem.getProduct());
        logger.info("Found {} stock entries for product ID: {}", stocks.size(), saleItem.getProduct().getProductId());
        
        int quantityToReduce = saleItem.getQuantity();
        for (StockDTO stock : stocks) {
            logger.info("Processing stock entry ID: {} with quantity: {}", stock.getStockId(), stock.getQuantity());
            if (quantityToReduce > 0) {
                int currentQuantity = stock.getQuantity() != null ? stock.getQuantity() : 0;
                int reduceAmount = Math.min(currentQuantity, quantityToReduce);
                stock.setQuantity(currentQuantity - reduceAmount);
                quantityToReduce -= reduceAmount;
                logger.info("Reducing stock ID: {} by {}. New quantity: {}. Remaining to reduce: {}", 
                    stock.getStockId(), reduceAmount, stock.getQuantity(), quantityToReduce);
                stockService.updateStock(stock.getStockId(), stock);
            }
        }
        
        if (quantityToReduce > 0) {
            throw new RuntimeException("Insufficient stock for product: " + saleItem.getProduct().getName() +
                ". Remaining quantity to reduce: " + quantityToReduce);
        }
    }

    private void adjustStockAfterUpdate(SaleItem saleItem, int quantityChange) {
        logger.info("Adjusting stock for product ID: {} (Name: {}) with quantity change: {}", 
            saleItem.getProduct().getProductId(), saleItem.getProduct().getName(), quantityChange);
        
        Integer totalAvailableStock = stockRepository.getTotalQuantity(saleItem.getProduct().getProductId());
        logger.info("Total available stock for product ID: {} is {}", saleItem.getProduct().getProductId(), totalAvailableStock);

        if (totalAvailableStock == null || (quantityChange > 0 && totalAvailableStock < quantityChange)) {
            throw new RuntimeException("Insufficient stock for product: " + saleItem.getProduct().getName() +
                ". Available: " + (totalAvailableStock != null ? totalAvailableStock : 0) + ", Required: " + quantityChange);
        }
        
        List<StockDTO> stocks = stockService.getStockByProduct(saleItem.getProduct());
        logger.info("Found {} stock entries for product ID: {}", stocks.size(), saleItem.getProduct().getProductId());
        
        int quantityToAdjust = Math.abs(quantityChange);
        boolean isIncrease = quantityChange < 0; // Negative change means increasing stock (reverting a sale)
        
        for (StockDTO stock : stocks) {
            logger.info("Processing stock entry ID: {} with quantity: {}", stock.getStockId(), stock.getQuantity());
            if (quantityToAdjust > 0) {
                int currentQuantity = stock.getQuantity() != null ? stock.getQuantity() : 0;
                int adjustAmount = Math.min(currentQuantity, quantityToAdjust);
                if (isIncrease) {
                    stock.setQuantity(currentQuantity + adjustAmount); // Increase stock (revert sale)
                } else {
                    stock.setQuantity(currentQuantity - adjustAmount); // Decrease stock (new sale)
                }
                quantityToAdjust -= adjustAmount;
                logger.info("Adjusting stock ID: {} by {}. New quantity: {}. Remaining to adjust: {}", 
                    stock.getStockId(), adjustAmount, stock.getQuantity(), quantityToAdjust);
                stockService.updateStock(stock.getStockId(), stock);
            }
        }
        
        if (quantityToAdjust > 0 && !isIncrease) {
            throw new RuntimeException("Insufficient stock for product: " + saleItem.getProduct().getName() +
                ". Remaining quantity to reduce: " + quantityToAdjust);
        }
    }

    @Transactional
    public void deleteSale(Long id) {
        try {
            logger.info("Deleting sale with ID: {}", id);
            saleRepository.deleteById(id);
            logger.info("Successfully deleted sale with ID: {}", id);
        } catch (Exception e) {
            logger.error("Error deleting sale: {}", e.getMessage(), e);
            throw new RuntimeException("Error deleting sale: " + e.getMessage());
        }
    }
}