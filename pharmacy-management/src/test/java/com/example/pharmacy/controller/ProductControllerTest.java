package com.example.pharmacy.controller;

import com.example.pharmacy.dto.ProductDTO;
import com.example.pharmacy.entity.Product;
import com.example.pharmacy.service.ProductService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for ProductController
 * Tests REST API endpoints for product management
 */
@SpringBootTest
@AutoConfigureMockMvc
class ProductControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ProductService productService;

    private ProductDTO testProductDTO;
    private Product testProduct;

    @BeforeEach
    void setUp() {
        testProductDTO = new ProductDTO();
        testProductDTO.setId(1L);
        testProductDTO.setName("Test Medicine");
        testProductDTO.setDescription("Test Description");
        testProductDTO.setPrice(new BigDecimal("99.99"));
        testProductDTO.setCategory("Antibiotics");
        testProductDTO.setSupplierId(1L);

        testProduct = new Product();
        testProduct.setId(1L);
        testProduct.setName("Test Medicine");
        testProduct.setDescription("Test Description");
        testProduct.setPrice(new BigDecimal("99.99"));
        testProduct.setCategory("Antibiotics");
    }

    @Test
    @WithMockUser(username = "admin", roles = { "ADMIN" })
    void testGetAllProducts_Success() throws Exception {
        // Arrange
        List<ProductDTO> products = Arrays.asList(testProductDTO);
        when(productService.getAllProducts()).thenReturn(products);

        // Act & Assert
        mockMvc.perform(get("/api/products")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Test Medicine"))
                .andExpect(jsonPath("$[0].price").value(99.99));
    }

    @Test
    @WithMockUser(username = "admin", roles = { "ADMIN" })
    void testGetProductById_Success() throws Exception {
        // Arrange
        when(productService.getProductById(1L)).thenReturn(Optional.of(testProduct));

        // Act & Assert
        mockMvc.perform(get("/api/products/1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Test Medicine"))
                .andExpect(jsonPath("$.price").value(99.99));
    }

    @Test
    @WithMockUser(username = "admin", roles = { "ADMIN" })
    void testGetProductById_NotFound() throws Exception {
        // Arrange
        when(productService.getProductById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        mockMvc.perform(get("/api/products/999")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(username = "admin", roles = { "ADMIN" })
    void testCreateProduct_Success() throws Exception {
        // Arrange
        when(productService.saveProductDTO(any(ProductDTO.class))).thenReturn(testProduct);

        // Act & Assert
        mockMvc.perform(post("/api/products")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testProductDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Test Medicine"))
                .andExpect(jsonPath("$.price").value(99.99));
    }

    @Test
    @WithMockUser(username = "admin", roles = { "ADMIN" })
    void testUpdateProduct_Success() throws Exception {
        // Arrange
        when(productService.updateProduct(any(Product.class))).thenReturn(testProduct);

        // Act & Assert
        mockMvc.perform(put("/api/products/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testProduct)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Test Medicine"));
    }

    @Test
    @WithMockUser(username = "admin", roles = { "ADMIN" })
    void testDeleteProduct_Success() throws Exception {
        // Act & Assert
        mockMvc.perform(delete("/api/products/1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNoContent());
    }

    @Test
    @WithMockUser(username = "admin", roles = { "ADMIN" })
    void testSearchProducts_Success() throws Exception {
        // Arrange
        List<Product> products = Arrays.asList(testProduct);
        when(productService.searchProducts("Test")).thenReturn(products);

        // Act & Assert
        mockMvc.perform(get("/api/products/search")
                .param("keyword", "Test")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Test Medicine"));
    }
}
