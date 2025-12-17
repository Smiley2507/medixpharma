package com.example.pharmacy.controller;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.pharmacy.entity.Product;
import com.example.pharmacy.entity.Supplier;
import com.example.pharmacy.service.ProductService;
import com.example.pharmacy.dto.ProductDTO;
import com.fasterxml.jackson.annotation.JsonProperty;

@RestController
@RequestMapping("api/products")
public class ProductController {
    private final ProductService productService;

    @Autowired
    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping(produces = "application/json")
    public ResponseEntity<?> getAllProducts() {
        try {
            List<ProductDTO> products = productService.getAllProducts();
            if (products == null || products.isEmpty()) {
                return new ResponseEntity<>(Map.of("error", "No products found"), HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(products, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(Map.of("error", e.getMessage()), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(Map.of("error", "Failed to fetch products: " + e.getMessage()),
                HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return productService.getProductById(id)
                .map(product -> new ResponseEntity<>(product, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Product>> searchProducts(@RequestParam String keyword) {
        List<Product> products = productService.searchProducts(keyword);
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    @GetMapping("/price-range")
    public ResponseEntity<List<Product>> getProductsByPriceRange(
            @RequestParam BigDecimal min,
            @RequestParam BigDecimal max) {
        List<Product> products = productService.getProductByPriceRange(min, max);
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    @PostMapping(consumes = "application/json", produces = "application/json")
    public ResponseEntity<?> createProduct(@RequestBody ProductDTO productDTO) {
        try {
            if (productDTO == null) {
                return new ResponseEntity<>(Map.of("error", "Product data is required"), HttpStatus.BAD_REQUEST);
            }

            // Validate required fields
            if (productDTO.getName() == null || productDTO.getName().trim().isEmpty()) {
                return new ResponseEntity<>(Map.of("error", "Product name is required"), HttpStatus.BAD_REQUEST);
            }
            if (productDTO.getPrice() == null || productDTO.getPrice().compareTo(BigDecimal.ZERO) <= 0) {
                return new ResponseEntity<>(Map.of("error", "Product price must be greater than 0"), HttpStatus.BAD_REQUEST);
            }
            if (productDTO.getSupplierId() == null) {
                return new ResponseEntity<>(Map.of("error", "Supplier ID is required"), HttpStatus.BAD_REQUEST);
            }

            Product savedProduct = productService.saveProductDTO(productDTO);
            return new ResponseEntity<>(savedProduct, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            e.printStackTrace();
            return new ResponseEntity<>(Map.of("error", e.getMessage()), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(Map.of("error", "An unexpected error occurred: " + e.getMessage()),
                HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable Long id, @RequestBody ProductUpdateRequest request) {
        try {
            Product product = new Product();
            product.setProductId(id);
            product.setName(request.getName());
            product.setGenericName(request.getGenericName());
            product.setManufacturer(request.getManufacturer());
            product.setDosage(request.getDosage());
            product.setPrice(request.getPrice() != null ? request.getPrice() : BigDecimal.ZERO); // Handle null

            // Handle supplier
            if (request.getSupplierId() != null) {
                Supplier supplier = new Supplier();
                supplier.setSupplierId(request.getSupplierId());
                product.setSupplier(supplier);
            }

            Product updatedProduct = productService.updateProduct(product);
            return new ResponseEntity<>(updatedProduct, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(Map.of("error", e.getMessage()), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(Map.of("error", "Failed to update product: " + e.getMessage()),
                HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        try {
            productService.deleteProduct(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public static class ProductUpdateRequest {
        private String name;
        private String genericName;
        private String manufacturer;
        private String dosage;
        private BigDecimal price;

        @JsonProperty("supplierId")
        private Long supplierId;

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getGenericName() { return genericName; }
        public void setGenericName(String genericName) { this.genericName = genericName; }

        public String getManufacturer() { return manufacturer; }
        public void setManufacturer(String manufacturer) { this.manufacturer = manufacturer; }

        public String getDosage() { return dosage; }
        public void setDosage(String dosage) { this.dosage = dosage; }

        public BigDecimal getPrice() { return price; }
        public void setPrice(BigDecimal price) { this.price = price; }

        public Long getSupplierId() { return supplierId; }
        public void setSupplierId(Long supplierId) { this.supplierId = supplierId; }
    }
}