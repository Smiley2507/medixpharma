package com.example.pharmacy.service;

import com.example.pharmacy.dto.ProductDTO;
import com.example.pharmacy.entity.Product;
import com.example.pharmacy.entity.Supplier;
import com.example.pharmacy.repository.ProductRepository;
import com.example.pharmacy.repository.SupplierRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

/**
 * Unit tests for ProductService
 * Tests business logic for product management operations
 */
@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private SupplierRepository supplierRepository;

    @InjectMocks
    private ProductService productService;

    private Product testProduct;
    private Supplier testSupplier;
    private ProductDTO testProductDTO;

    @BeforeEach
    void setUp() {
        // Initialize test data
        testSupplier = new Supplier();
        testSupplier.setSupplierId(1L);
        testSupplier.setName("Test Supplier");
        testSupplier.setEmail("supplier@test.com");

        testProduct = new Product();
        testProduct.setProductId(1L);
        testProduct.setName("Test Medicine");
        testProduct.setGenericName("Generic Medicine");
        testProduct.setPrice(new BigDecimal("99.99"));
        testProduct.setSupplier(testSupplier);

        testProductDTO = new ProductDTO();
        testProductDTO.setProductId(1L);
        testProductDTO.setName("Test Medicine");
        testProductDTO.setGenericName("Generic Medicine");
        testProductDTO.setPrice(new BigDecimal("99.99"));
        testProductDTO.setSupplierId(1L);
    }

    @Test
    void testGetAllProducts_Success() {
        // Arrange
        List<Product> products = Arrays.asList(testProduct);
        when(productRepository.findAll()).thenReturn(products);

        // Act
        List<ProductDTO> result = productService.getAllProducts();

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Test Medicine", result.get(0).getName());
        verify(productRepository, times(1)).findAll();
    }

    @Test
    void testGetProductById_Success() {
        // Arrange
        when(productRepository.findById(1L)).thenReturn(Optional.of(testProduct));

        // Act
        Optional<Product> result = productService.getProductById(1L);

        // Assert
        assertTrue(result.isPresent());
        assertEquals("Test Medicine", result.get().getName());
        verify(productRepository, times(1)).findById(1L);
    }

    @Test
    void testGetProductById_NotFound() {
        // Arrange
        when(productRepository.findById(999L)).thenReturn(Optional.empty());

        // Act
        Optional<Product> result = productService.getProductById(999L);

        // Assert
        assertFalse(result.isPresent());
        verify(productRepository, times(1)).findById(999L);
    }

    @Test
    void testSaveProductDTO_Success() {
        // Arrange
        when(supplierRepository.findById(1L)).thenReturn(Optional.of(testSupplier));
        when(productRepository.save(any(Product.class))).thenReturn(testProduct);

        // Act
        Product result = productService.saveProductDTO(testProductDTO);

        // Assert
        assertNotNull(result);
        assertEquals("Test Medicine", result.getName());
        assertEquals(new BigDecimal("99.99"), result.getPrice());
        verify(supplierRepository, times(1)).findById(1L);
        verify(productRepository, times(1)).save(any(Product.class));
    }

    @Test
    void testDeleteProduct_Success() {
        // Arrange
        doNothing().when(productRepository).deleteById(1L);

        // Act
        productService.deleteProduct(1L);

        // Assert
        verify(productRepository, times(1)).deleteById(1L);
    }

    @Test
    void testSearchProducts_Success() {
        // Arrange
        List<Product> products = Arrays.asList(testProduct);
        when(productRepository.findByNameContaining("Test"))
                .thenReturn(products);

        // Act
        List<Product> result = productService.searchProducts("Test");

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Test Medicine", result.get(0).getName());
        verify(productRepository, times(1)).findByNameContaining("Test");
    }

    @Test
    void testGetProductByPriceRange_Success() {
        // Arrange
        BigDecimal minPrice = new BigDecimal("50.00");
        BigDecimal maxPrice = new BigDecimal("150.00");
        List<Product> products = Arrays.asList(testProduct);
        when(productRepository.findByPriceBetween(minPrice, maxPrice))
                .thenReturn(products);

        // Act
        List<Product> result = productService.getProductByPriceRange(minPrice, maxPrice);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertTrue(result.get(0).getPrice().compareTo(minPrice) >= 0);
        assertTrue(result.get(0).getPrice().compareTo(maxPrice) <= 0);
        verify(productRepository, times(1)).findByPriceBetween(minPrice, maxPrice);
    }

    @Test
    void testGetProductsBySupplier_Success() {
        // Arrange
        List<Product> products = Arrays.asList(testProduct);
        when(productRepository.findBySupplier(testSupplier)).thenReturn(products);

        // Act
        List<Product> result = productService.getProductsBySupplier(testSupplier);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(testSupplier.getSupplierId(), result.get(0).getSupplier().getSupplierId());
        verify(productRepository, times(1)).findBySupplier(testSupplier);
    }
}
