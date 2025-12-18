package com.example.pharmacy.controller;

import com.example.pharmacy.dto.ProductDTO;
import com.example.pharmacy.entity.Product;
import com.example.pharmacy.service.ProductService;
import com.example.pharmacy.service.UserDetailsServiceImpl;
import com.example.pharmacy.security.JwtUtils;
import com.example.pharmacy.security.AuthEntryPointJwt;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.example.pharmacy.repository.RoleRepository;

/**
 * Integration tests for ProductController
 * Tests REST API endpoints for product management
 */
@WebMvcTest(ProductController.class)
class ProductControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private UserDetailsServiceImpl userDetailsService;

    @MockBean
    private JwtUtils jwtUtils;

    @MockBean
    private AuthEntryPointJwt unauthorizedHandler;

    @MockBean
    private RoleRepository roleRepository;

    @MockBean
    private ProductService productService;

    private ProductDTO testProductDTO;
    private Product testProduct;

    @BeforeEach
    void setUp() {
        testProductDTO = new ProductDTO();
        testProductDTO.setProductId(1L);
        testProductDTO.setName("Test Medicine");
        testProductDTO.setGenericName("Generic Medicine");
        testProductDTO.setPrice(new BigDecimal("99.99"));
        testProductDTO.setSupplierId(1L);

        testProduct = new Product();
        testProduct.setProductId(1L);
        testProduct.setName("Test Medicine");
        testProduct.setGenericName("Generic Medicine");
        testProduct.setPrice(new BigDecimal("99.99"));
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
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testProductDTO)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Test Medicine"))
                .andExpect(jsonPath("$.price").value(99.99));
    }

    @Test
    @WithMockUser(username = "admin", roles = { "ADMIN" })
    void testUpdateProduct_Success() throws Exception {
        // Arrange
        ProductController.ProductUpdateRequest updateRequest = new ProductController.ProductUpdateRequest();
        updateRequest.setName("Test Medicine");
        updateRequest.setPrice(new BigDecimal("99.99"));
        updateRequest.setSupplierId(1L);

        when(productService.updateProduct(any(Product.class))).thenReturn(testProduct);

        // Act & Assert
        mockMvc.perform(put("/api/products/1")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Test Medicine"));
    }

    @Test
    @WithMockUser(username = "admin", roles = { "ADMIN" })
    void testDeleteProduct_Success() throws Exception {
        // Act & Assert
        mockMvc.perform(delete("/api/products/1")
                .with(csrf())
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
