package com.example.pharmacy.service;

import com.example.pharmacy.dto.SaleItemDTO;
import com.example.pharmacy.entity.Product;
import com.example.pharmacy.entity.Sale;
import com.example.pharmacy.entity.SaleItem;
import com.example.pharmacy.repository.ProductRepository;
import com.example.pharmacy.repository.SaleItemRepository;
import com.example.pharmacy.repository.SaleRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SaleItemService {
    private static final Logger logger = LoggerFactory.getLogger(SaleItemService.class);

    private final SaleItemRepository saleItemRepository;
    private final SaleRepository saleRepository;
    private final ProductRepository productRepository;

    @Autowired
    public SaleItemService(SaleItemRepository saleItemRepository, SaleRepository saleRepository, ProductRepository productRepository) {
        this.saleItemRepository = saleItemRepository;
        this.saleRepository = saleRepository;
        this.productRepository = productRepository;
    }

    @Transactional(readOnly = true)
    public List<SaleItemDTO> getAllSaleItems() {
        try {
            logger.info("Fetching all sale items");
            List<SaleItem> saleItems = saleItemRepository.findAll();
            return saleItems.stream()
                .map(saleItem -> {
                    SaleItemDTO dto = new SaleItemDTO();
                    dto.setSaleItemId(saleItem.getSaleItemId());
                    dto.setSaleId(saleItem.getSale() != null ? saleItem.getSale().getSaleId() : null);
                    dto.setProductId(saleItem.getProduct() != null ? saleItem.getProduct().getProductId() : null);
                    dto.setProductName(saleItem.getProduct() != null ? saleItem.getProduct().getName() : null);
                    dto.setQuantity(saleItem.getQuantity());
                    dto.setUnitPrice(saleItem.getUnitPrice());
                    dto.setTotalPrice(saleItem.getTotalPrice());
                    return dto;
                })
                .collect(Collectors.toList());
        } catch (Exception e) {
            logger.error("Error fetching sale items: {}", e.getMessage(), e);
            throw new RuntimeException("Error fetching sale items: " + e.getMessage());
        }
    }

    @Transactional
    public SaleItemDTO createSaleItem(SaleItemDTO saleItemDTO) {
        try {
            logger.info("Creating sale item for product ID: {}", saleItemDTO.getProductId());

            // Validate required fields
            if (saleItemDTO.getSaleId() == null) {
                throw new RuntimeException("Sale ID is required");
            }
            if (saleItemDTO.getProductId() == null) {
                throw new RuntimeException("Product ID is required");
            }
            if (saleItemDTO.getQuantity() == null || saleItemDTO.getQuantity() <= 0) {
                throw new RuntimeException("Quantity must be greater than 0");
            }
            if (saleItemDTO.getUnitPrice() == null || saleItemDTO.getUnitPrice().compareTo(BigDecimal.ZERO) <= 0) {
                throw new RuntimeException("Unit price must be greater than 0");
            }

            // Fetch Sale and Product entities
            Sale sale = saleRepository.findById(saleItemDTO.getSaleId())
                .orElseThrow(() -> new RuntimeException("Sale not found with ID: " + saleItemDTO.getSaleId()));
            Product product = productRepository.findById(saleItemDTO.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found with ID: " + saleItemDTO.getProductId()));

            // Create SaleItem entity
            SaleItem saleItem = new SaleItem();
            saleItem.setSale(sale);
            saleItem.setProduct(product);
            saleItem.setQuantity(saleItemDTO.getQuantity());
            saleItem.setUnitPrice(saleItemDTO.getUnitPrice());
            saleItem.setTotalPrice(saleItemDTO.getUnitPrice().multiply(BigDecimal.valueOf(saleItemDTO.getQuantity())));

            SaleItem savedSaleItem = saleItemRepository.save(saleItem);

            // Map to DTO for response
            SaleItemDTO dto = new SaleItemDTO();
            dto.setSaleItemId(savedSaleItem.getSaleItemId());
            dto.setSaleId(savedSaleItem.getSale().getSaleId());
            dto.setProductId(savedSaleItem.getProduct().getProductId());
            dto.setProductName(savedSaleItem.getProduct().getName());
            dto.setQuantity(savedSaleItem.getQuantity());
            dto.setUnitPrice(savedSaleItem.getUnitPrice());
            dto.setTotalPrice(savedSaleItem.getTotalPrice());
            logger.info("Successfully created sale item with ID: {}", savedSaleItem.getSaleItemId());
            return dto;
        } catch (Exception e) {
            logger.error("Error creating sale item: {}", e.getMessage(), e);
            throw new RuntimeException("Error creating sale item: " + e.getMessage());
        }
    }

    @Transactional(readOnly = true)
    public SaleItemDTO getSaleItemById(Long id) {
        try {
            logger.info("Fetching sale item with ID: {}", id);
            SaleItem saleItem = saleItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sale item not found with id: " + id));
            
            SaleItemDTO dto = new SaleItemDTO();
            dto.setSaleItemId(saleItem.getSaleItemId());
            dto.setSaleId(saleItem.getSale() != null ? saleItem.getSale().getSaleId() : null);
            dto.setProductId(saleItem.getProduct() != null ? saleItem.getProduct().getProductId() : null);
            dto.setProductName(saleItem.getProduct() != null ? saleItem.getProduct().getName() : null);
            dto.setQuantity(saleItem.getQuantity());
            dto.setUnitPrice(saleItem.getUnitPrice());
            dto.setTotalPrice(saleItem.getTotalPrice());
            return dto;
        } catch (Exception e) {
            logger.error("Error fetching sale item: {}", e.getMessage(), e);
            throw new RuntimeException("Error fetching sale item: " + e.getMessage());
        }
    }

    @Transactional
    public SaleItemDTO updateSaleItem(Long id, SaleItemDTO saleItemDTO) {
        try {
            logger.info("Updating sale item with ID: {}", id);

            // Validate required fields
            if (saleItemDTO.getSaleId() == null) {
                throw new RuntimeException("Sale ID is required");
            }
            if (saleItemDTO.getProductId() == null) {
                throw new RuntimeException("Product ID is required");
            }
            if (saleItemDTO.getQuantity() == null || saleItemDTO.getQuantity() <= 0) {
                throw new RuntimeException("Quantity must be greater than 0");
            }
            if (saleItemDTO.getUnitPrice() == null || saleItemDTO.getUnitPrice().compareTo(BigDecimal.ZERO) <= 0) {
                throw new RuntimeException("Unit price must be greater than 0");
            }

            SaleItem saleItem = saleItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sale item not found with id: " + id));

            // Fetch Sale and Product entities
            Sale sale = saleRepository.findById(saleItemDTO.getSaleId())
                .orElseThrow(() -> new RuntimeException("Sale not found with ID: " + saleItemDTO.getSaleId()));
            Product product = productRepository.findById(saleItemDTO.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found with ID: " + saleItemDTO.getProductId()));

            // Update SaleItem fields
            saleItem.setSale(sale);
            saleItem.setProduct(product);
            saleItem.setQuantity(saleItemDTO.getQuantity());
            saleItem.setUnitPrice(saleItemDTO.getUnitPrice());
            saleItem.setTotalPrice(saleItemDTO.getUnitPrice().multiply(BigDecimal.valueOf(saleItemDTO.getQuantity())));

            SaleItem updatedSaleItem = saleItemRepository.save(saleItem);

            // Map to DTO for response
            SaleItemDTO dto = new SaleItemDTO();
            dto.setSaleItemId(updatedSaleItem.getSaleItemId());
            dto.setSaleId(updatedSaleItem.getSale().getSaleId());
            dto.setProductId(updatedSaleItem.getProduct().getProductId());
            dto.setProductName(updatedSaleItem.getProduct().getName());
            dto.setQuantity(updatedSaleItem.getQuantity());
            dto.setUnitPrice(updatedSaleItem.getUnitPrice());
            dto.setTotalPrice(updatedSaleItem.getTotalPrice());
            logger.info("Successfully updated sale item with ID: {}", updatedSaleItem.getSaleItemId());
            return dto;
        } catch (Exception e) {
            logger.error("Error updating sale item: {}", e.getMessage(), e);
            throw new RuntimeException("Error updating sale item: " + e.getMessage());
        }
    }

    @Transactional
    public void deleteSaleItem(Long id) {
        try {
            logger.info("Deleting sale item with ID: {}", id);
            SaleItem saleItem = saleItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sale item not found with id: " + id));
            saleItemRepository.delete(saleItem);
            logger.info("Successfully deleted sale item with ID: {}", id);
        } catch (Exception e) {
            logger.error("Error deleting sale item: {}", e.getMessage(), e);
            throw new RuntimeException("Error deleting sale item: " + e.getMessage());
        }
    }

    public List<SaleItem> getSaleItemsBySale(Sale sale) {
        logger.info("Fetching sale items for sale ID: {}", sale.getSaleId());
        return saleItemRepository.findBySale(sale);
    }
    
    public List<SaleItem> getSaleItemsByProduct(Product product) {
        logger.info("Fetching sale items for product ID: {}", product.getProductId());
        return saleItemRepository.findByProduct(product);
    }
    
    public List<Object[]> getMostSoldProducts() {
        logger.info("Fetching most sold products");
        return saleItemRepository.findMostSoldProducts();
    }
}