package com.example.pharmacy.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.ArrayList;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.example.pharmacy.entity.Product;
import com.example.pharmacy.entity.Supplier;
import com.example.pharmacy.repository.ProductRepository;
import com.example.pharmacy.repository.SupplierRepository;
import com.example.pharmacy.dto.ProductDTO;

import jakarta.transaction.Transactional;

@Service
public class ProductService {
    private static final Logger logger = LoggerFactory.getLogger(ProductService.class);
    private final ProductRepository productRepository;
    private final SupplierRepository supplierRepository;

    @Autowired
    public ProductService(ProductRepository productRepository, SupplierRepository supplierRepository) {
        this.productRepository = productRepository;
        this.supplierRepository = supplierRepository;
    }

    public List<ProductDTO> getAllProducts() {
        try {
            List<Product> products = productRepository.findAll();
            return products.stream()
                .map(product -> {
                    ProductDTO dto = new ProductDTO();
                    dto.setProductId(product.getProductId());
                    dto.setName(product.getName());
                    dto.setGenericName(product.getGenericName());
                    dto.setManufacturer(product.getManufacturer());
                    dto.setDosage(product.getDosage());
                    dto.setPrice(product.getPrice() != null ? product.getPrice() : BigDecimal.ZERO); // Convert Double to BigDecimal
                    
                    if (product.getSupplier() != null) {
                        dto.setSupplierId(product.getSupplier().getSupplierId());
                        dto.setSupplierName(product.getSupplier().getName());
                    }
                    
                    return dto;
                })
                .collect(Collectors.toList());
        } catch (Exception e) {
            logger.error("Error fetching products: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to fetch products: " + e.getMessage());
        }
    }

    public Optional<Product> getProductById(Long id) {
        Optional<Product> product = productRepository.findById(id);
        // Initialize supplier if product exists
        product.ifPresent(p -> {
            if (p.getSupplier() != null) {
                p.getSupplier().getSupplierId();
            }
        });
        return product;
    }

    public List<Product> searchProducts(String keyword) {
        return productRepository.findByNameContaining(keyword);
    }

    public List<Product> getProductsBySupplier(Supplier supplier) {
        return productRepository.findBySupplier(supplier);
    }

    public List<Product> getProductByPriceRange(BigDecimal minPrice, BigDecimal maxPrice) {
        return productRepository.findByPriceBetween(minPrice, maxPrice);
    }

    @Transactional
    public Product saveProductDTO(ProductDTO productDTO) {
        try {
            logger.info("Starting product creation: {}", productDTO.getName());

            // Validate required fields
            if (productDTO.getName() == null || productDTO.getName().trim().isEmpty()) {
                throw new RuntimeException("Product name is required");
            }
            if (productDTO.getPrice() == null || productDTO.getPrice().compareTo(BigDecimal.ZERO) <= 0) {
                throw new RuntimeException("Product price must be greater than 0");
            }
            if (productDTO.getSupplierId() == null) {
                throw new RuntimeException("Supplier ID is required");
            }

            // Fetch the supplier from the database
            Supplier supplier = supplierRepository.findById(productDTO.getSupplierId())
                .orElseThrow(() -> new RuntimeException("Supplier not found with ID: " + productDTO.getSupplierId()));

            // Create the product entity
            Product product = new Product();
            product.setName(productDTO.getName());
            product.setGenericName(productDTO.getGenericName());
            product.setManufacturer(productDTO.getManufacturer());
            product.setDosage(productDTO.getDosage());
            product.setPrice(productDTO.getPrice());
            product.setSupplier(supplier);

            // Initialize empty lists for relationships
            if (product.getStocks() == null) {
                product.setStocks(new ArrayList<>());
            }
            if (product.getSalesItems() == null) {
                product.setSalesItems(new ArrayList<>());
            }

            logger.info("Saving new product with supplier ID: {}", supplier.getSupplierId());
            Product savedProduct = productRepository.save(product);
            logger.info("Successfully created product: {}", savedProduct.getName());

            return savedProduct;
        } catch (Exception e) {
            logger.error("Error creating product: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to create product: " + e.getMessage(), e);
        }
    }

    @Transactional
    public Product SaveProduct(Product product) { // Legacy method, can be removed if unused
        try {
            logger.info("Starting product creation: {}", product.getName());
            
            // Validate required fields
            if (product.getName() == null || product.getName().trim().isEmpty()) {
                throw new RuntimeException("Product name is required");
            }
            if (product.getPrice() == null || product.getPrice().compareTo(BigDecimal.ZERO) <= 0) {
                throw new RuntimeException("Product price must be greater than 0");
            }
            if (product.getSupplier() == null || product.getSupplier().getSupplierId() == null) {
                throw new RuntimeException("Supplier is required");
            }

            // Fetch the supplier from the database
            Supplier supplier = supplierRepository.findById(product.getSupplier().getSupplierId())
                .orElseThrow(() -> new RuntimeException("Supplier not found with ID: " + product.getSupplier().getSupplierId()));
            product.setSupplier(supplier);

            // Initialize empty lists for relationships
            if (product.getStocks() == null) {
                product.setStocks(new ArrayList<>());
            }
            if (product.getSalesItems() == null) {
                product.setSalesItems(new ArrayList<>());
            }

            logger.info("Saving new product with supplier ID: {}", supplier.getSupplierId());
            Product savedProduct = productRepository.save(product);
            logger.info("Successfully created product: {}", savedProduct.getName());
            
            return savedProduct;
        } catch (Exception e) {
            logger.error("Error creating product: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to create product: " + e.getMessage(), e);
        }
    }

    @Transactional
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    @Transactional
    public Product updateProduct(Product product) {
        try {
            logger.info("Starting product update for ID: {}", product.getProductId());
            
            if (!productRepository.existsById(product.getProductId())) {
                logger.error("Product not found with ID: {}", product.getProductId());
                throw new RuntimeException("Product not found with id: " + product.getProductId());
            }

            // Get the existing product to preserve relationships
            Product existingProduct = productRepository.findById(product.getProductId())
                .orElseThrow(() -> {
                    logger.error("Failed to fetch existing product with ID: {}", product.getProductId());
                    return new RuntimeException("Product not found with id: " + product.getProductId());
                });

            logger.info("Found existing product: {}", existingProduct.getName());

            // Update only the fields that should be updated
            existingProduct.setName(product.getName());
            existingProduct.setGenericName(product.getGenericName());
            existingProduct.setManufacturer(product.getManufacturer());
            existingProduct.setDosage(product.getDosage());
            existingProduct.setPrice(product.getPrice());
            
            // Handle supplier update
            if (product.getSupplier() != null && product.getSupplier().getSupplierId() != null) {
                logger.info("Updating supplier to ID: {}", product.getSupplier().getSupplierId());
                Supplier supplier = supplierRepository.findById(product.getSupplier().getSupplierId())
                    .orElseThrow(() -> new RuntimeException("Supplier not found with ID: " + product.getSupplier().getSupplierId()));
                existingProduct.setSupplier(supplier);
            } else {
                logger.info("No supplier update provided, keeping existing supplier");
            }

            logger.info("Saving updated product");
            Product savedProduct = productRepository.save(existingProduct);
            logger.info("Successfully updated product: {}", savedProduct.getName());
            
            return savedProduct;
        } catch (Exception e) {
            logger.error("Error updating product: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to update product: " + e.getMessage(), e);
        }
    }
}