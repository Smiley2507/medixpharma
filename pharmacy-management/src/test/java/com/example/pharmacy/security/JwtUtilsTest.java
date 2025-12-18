package com.example.pharmacy.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.util.ReflectionTestUtils;

import com.example.pharmacy.service.UserDetailsImpl;

import java.util.HashSet;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

/**
 * Unit tests for JwtUtils
 * Tests JWT token generation and validation
 */
@ExtendWith(MockitoExtension.class)
class JwtUtilsTest {

    @InjectMocks
    private JwtUtils jwtUtils;

    @Mock
    private Authentication authentication;

    private UserDetailsImpl userDetails;

    @BeforeEach
    void setUp() {
        // Set test values for JWT secret and expiration
        ReflectionTestUtils.setField(jwtUtils, "jwtSecret",
                "testSecretKeyForJWTTokenGenerationAndValidation12345678901234567890");
        ReflectionTestUtils.setField(jwtUtils, "jwtExpirationMs", 86400000);

        // Create test user details
        Set<GrantedAuthority> authorities = new HashSet<>();
        authorities.add(new SimpleGrantedAuthority("ROLE_USER"));

        userDetails = new UserDetailsImpl(
                1L,
                "testuser",
                "test@example.com",
                "password",
                authorities,
                "Test User",
                "1234567890",
                true);
    }

    @Test
    void testGenerateJwtToken_Success() {
        // Arrange
        when(authentication.getPrincipal()).thenReturn(userDetails);

        // Act
        String token = jwtUtils.generateJwtToken(authentication);

        // Assert
        assertNotNull(token);
        assertFalse(token.isEmpty());
        assertTrue(token.split("\\.").length == 3); // JWT has 3 parts
    }

    @Test
    void testGetUserNameFromJwtToken_Success() {
        // Arrange
        when(authentication.getPrincipal()).thenReturn(userDetails);
        String token = jwtUtils.generateJwtToken(authentication);

        // Act
        String username = jwtUtils.getUserNameFromJwtToken(token);

        // Assert
        assertEquals("test@example.com", username);
    }

    @Test
    void testValidateJwtToken_ValidToken() {
        // Arrange
        when(authentication.getPrincipal()).thenReturn(userDetails);
        String token = jwtUtils.generateJwtToken(authentication);

        // Act
        boolean isValid = jwtUtils.validateJwtToken(token);

        // Assert
        assertTrue(isValid);
    }

    @Test
    void testValidateJwtToken_InvalidToken() {
        // Arrange
        String invalidToken = "invalid.jwt.token";

        // Act
        boolean isValid = jwtUtils.validateJwtToken(invalidToken);

        // Assert
        assertFalse(isValid);
    }

    @Test
    void testValidateJwtToken_EmptyToken() {
        // Arrange
        String emptyToken = "";

        // Act
        boolean isValid = jwtUtils.validateJwtToken(emptyToken);

        // Assert
        assertFalse(isValid);
    }

    @Test
    void testValidateJwtToken_NullToken() {
        // Arrange
        String nullToken = null;

        // Act
        boolean isValid = jwtUtils.validateJwtToken(nullToken);

        // Assert
        assertFalse(isValid);
    }

    @Test
    void testJwtTokenContainsUserInformation() {
        // Arrange
        when(authentication.getPrincipal()).thenReturn(userDetails);

        // Act
        String token = jwtUtils.generateJwtToken(authentication);
        String username = jwtUtils.getUserNameFromJwtToken(token);

        // Assert
        assertEquals(userDetails.getUsername(), username);
    }
}
