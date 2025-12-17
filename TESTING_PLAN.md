# Testing Plan - Pharmacy Management System

## Overview
This document outlines the comprehensive testing strategy for the Pharmacy Management System. The testing plan covers unit tests, integration tests, and end-to-end tests to ensure the application meets all functional and non-functional requirements.

---

## 1. Testing Strategy

### 1.1 Testing Pyramid
Our testing approach follows the testing pyramid principle:
- **70% Unit Tests**: Fast, isolated tests for individual components
- **20% Integration Tests**: Tests for component interactions
- **10% End-to-End Tests**: Full system tests

### 1.2 Testing Tools
- **Backend Testing**:
  - JUnit 5 - Testing framework
  - Mockito - Mocking framework
  - Spring Boot Test - Integration testing
  - MockMvc - REST API testing
  - H2 Database - In-memory database for testing

- **Frontend Testing** (Recommended):
  - Jest - JavaScript testing framework
  - React Testing Library - Component testing
  - Cypress - E2E testing

---

## 2. Backend Testing

### 2.1 Unit Tests

#### 2.1.1 Service Layer Tests
**Purpose**: Test business logic in isolation

**Test Cases for ProductService**:
1. ✅ **testGetAllProducts_Success**
   - Verify all products are retrieved
   - Expected: List of ProductDTO objects

2. ✅ **testGetProductById_Success**
   - Verify product retrieval by valid ID
   - Expected: Product object with matching ID

3. ✅ **testGetProductById_NotFound**
   - Verify behavior when product doesn't exist
   - Expected: Empty Optional

4. ✅ **testSaveProductDTO_Success**
   - Verify product creation with valid data
   - Expected: Saved product with generated ID

5. ✅ **testDeleteProduct_Success**
   - Verify product deletion
   - Expected: Product removed from database

6. ✅ **testSearchProducts_Success**
   - Verify product search by keyword
   - Expected: List of matching products

7. ✅ **testGetProductByPriceRange_Success**
   - Verify price range filtering
   - Expected: Products within specified range

8. ✅ **testGetProductsBySupplier_Success**
   - Verify filtering by supplier
   - Expected: Products from specific supplier

**Test Cases for UserService** (To be implemented):
1. testCreateUser_Success
2. testCreateUser_DuplicateEmail
3. testAuthenticateUser_Success
4. testAuthenticateUser_InvalidCredentials
5. testUpdateUserProfile_Success
6. testDeleteUser_Success

**Test Cases for SaleService** (To be implemented):
1. testCreateSale_Success
2. testCreateSale_InsufficientStock
3. testGetSalesByDateRange_Success
4. testCalculateTotalRevenue_Success
5. testGetSalesByUser_Success

#### 2.1.2 Security Tests
**Purpose**: Test authentication and authorization

**Test Cases for JwtUtils**:
1. ✅ **testGenerateJwtToken_Success**
   - Verify JWT token generation
   - Expected: Valid JWT token string

2. ✅ **testGetUserNameFromJwtToken_Success**
   - Verify username extraction from token
   - Expected: Correct username

3. ✅ **testValidateJwtToken_ValidToken**
   - Verify valid token validation
   - Expected: true

4. ✅ **testValidateJwtToken_InvalidToken**
   - Verify invalid token rejection
   - Expected: false

5. ✅ **testValidateJwtToken_ExpiredToken**
   - Verify expired token handling
   - Expected: false

6. ✅ **testValidateJwtToken_NullToken**
   - Verify null token handling
   - Expected: false

### 2.2 Integration Tests

#### 2.2.1 Controller Tests
**Purpose**: Test REST API endpoints with Spring context

**Test Cases for ProductController**:
1. ✅ **testGetAllProducts_Success**
   - HTTP GET /api/products
   - Expected: 200 OK with product list

2. ✅ **testGetProductById_Success**
   - HTTP GET /api/products/{id}
   - Expected: 200 OK with product details

3. ✅ **testGetProductById_NotFound**
   - HTTP GET /api/products/{invalid_id}
   - Expected: 404 Not Found

4. ✅ **testCreateProduct_Success**
   - HTTP POST /api/products
   - Expected: 200 OK with created product

5. ✅ **testCreateProduct_InvalidData**
   - HTTP POST /api/products with invalid data
   - Expected: 400 Bad Request

6. ✅ **testUpdateProduct_Success**
   - HTTP PUT /api/products/{id}
   - Expected: 200 OK with updated product

7. ✅ **testDeleteProduct_Success**
   - HTTP DELETE /api/products/{id}
   - Expected: 204 No Content

8. ✅ **testSearchProducts_Success**
   - HTTP GET /api/products/search?keyword=test
   - Expected: 200 OK with matching products

**Test Cases for AuthController** (To be implemented):
1. testLogin_Success
2. testLogin_InvalidCredentials
3. testRegister_Success
4. testRegister_DuplicateEmail
5. testVerifyOtp_Success
6. testVerifyOtp_InvalidOtp
7. testLogout_Success

**Test Cases for SaleController** (To be implemented):
1. testCreateSale_Success
2. testGetSaleById_Success
3. testGetAllSales_Success
4. testGetSalesByDateRange_Success
5. testDeleteSale_Success

#### 2.2.2 Repository Tests
**Purpose**: Test database operations

**Test Cases for ProductRepository** (To be implemented):
1. testFindByNameContainingIgnoreCase
2. testFindBySupplier
3. testFindByPriceBetween
4. testFindByCategory
5. testSaveProduct
6. testDeleteProduct

### 2.3 Security Integration Tests
**Purpose**: Test security configuration

**Test Cases** (To be implemented):
1. testAccessProtectedEndpoint_WithoutAuth_Unauthorized
2. testAccessProtectedEndpoint_WithValidToken_Success
3. testAccessProtectedEndpoint_WithExpiredToken_Unauthorized
4. testAccessAdminEndpoint_WithUserRole_Forbidden
5. testAccessAdminEndpoint_WithAdminRole_Success

---

## 3. Frontend Testing (Recommended)

### 3.1 Component Tests
**Purpose**: Test React components in isolation

**Test Cases**:
1. Login Component
   - Renders login form
   - Validates email format
   - Handles login submission
   - Displays error messages

2. Product List Component
   - Renders product list
   - Handles search functionality
   - Handles pagination
   - Handles product deletion

3. Product Form Component
   - Renders form fields
   - Validates input data
   - Handles form submission
   - Displays validation errors

4. Dashboard Component
   - Renders statistics
   - Fetches and displays data
   - Handles loading states
   - Handles error states

### 3.2 Integration Tests
**Purpose**: Test component interactions

**Test Cases**:
1. User Authentication Flow
   - Login → Dashboard navigation
   - Logout → Login redirect
   - Protected route access

2. Product Management Flow
   - Create product → List update
   - Edit product → List update
   - Delete product → List update

3. Sales Management Flow
   - Create sale → Stock update
   - View sale details
   - Generate reports

---

## 4. End-to-End Tests

### 4.1 User Workflows
**Purpose**: Test complete user journeys

**Test Scenarios**:

1. **User Registration and Login**
   - Navigate to registration page
   - Fill registration form
   - Verify OTP
   - Login with credentials
   - Access dashboard

2. **Product Management**
   - Login as admin
   - Navigate to products page
   - Create new product
   - Search for product
   - Edit product details
   - Delete product

3. **Sales Process**
   - Login as user
   - Navigate to sales page
   - Select products
   - Create sale
   - Verify stock update
   - View sale receipt

4. **Inventory Management**
   - Login as admin
   - View stock levels
   - Update stock
   - View low stock alerts
   - Generate inventory report

---

## 5. Test Execution

### 5.1 Running Backend Tests

```bash
# Run all tests
cd pharmacy-management
./mvnw test

# Run specific test class
./mvnw test -Dtest=ProductServiceTest

# Run tests with coverage
./mvnw test jacoco:report

# View coverage report
# Open target/site/jacoco/index.html in browser
```

### 5.2 Running Frontend Tests

```bash
# Run all tests
cd pharmacy_frontend
npm test

# Run tests with coverage
npm test -- --coverage

# Run E2E tests
npm run test:e2e
```

---

## 6. Test Coverage Goals

### 6.1 Backend Coverage Targets
- **Overall Coverage**: ≥ 80%
- **Service Layer**: ≥ 90%
- **Controller Layer**: ≥ 85%
- **Repository Layer**: ≥ 75%
- **Security Layer**: ≥ 90%

### 6.2 Frontend Coverage Targets
- **Overall Coverage**: ≥ 70%
- **Components**: ≥ 75%
- **Utilities**: ≥ 85%
- **Services**: ≥ 80%

---

## 7. Test Data Management

### 7.1 Test Data Strategy
- Use in-memory H2 database for backend tests
- Create test data in `@BeforeEach` methods
- Clean up test data in `@AfterEach` methods
- Use factories/builders for complex test objects

### 7.2 Test Data Examples

```java
// Product test data
Product testProduct = Product.builder()
    .name("Test Medicine")
    .description("Test Description")
    .price(new BigDecimal("99.99"))
    .category("Antibiotics")
    .build();

// User test data
User testUser = User.builder()
    .username("testuser")
    .email("test@example.com")
    .password("encodedPassword")
    .build();
```

---

## 8. Continuous Integration

### 8.1 CI/CD Pipeline
1. **On Push/PR**:
   - Run all unit tests
   - Run integration tests
   - Generate coverage report
   - Fail build if coverage < 80%

2. **On Merge to Main**:
   - Run full test suite
   - Run E2E tests
   - Deploy to staging
   - Run smoke tests

### 8.2 GitHub Actions Configuration

```yaml
name: Tests

on: [push, pull_request]

jobs:
  backend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Set up JDK 21
        uses: actions/setup-java@v2
        with:
          java-version: '21'
      - name: Run tests
        run: |
          cd pharmacy-management
          ./mvnw test
      - name: Generate coverage report
        run: ./mvnw jacoco:report
```

---

## 9. Test Metrics and Reporting

### 9.1 Key Metrics
- **Test Count**: Total number of tests
- **Pass Rate**: Percentage of passing tests
- **Coverage**: Code coverage percentage
- **Execution Time**: Time to run all tests
- **Flaky Tests**: Tests that fail intermittently

### 9.2 Reporting
- Generate JaCoCo coverage reports
- Track test metrics over time
- Review failed tests in CI/CD
- Monitor test execution time

---

## 10. Best Practices

### 10.1 Test Writing Guidelines
1. **Follow AAA Pattern**: Arrange, Act, Assert
2. **One Assertion Per Test**: Focus on single behavior
3. **Descriptive Names**: Use clear, descriptive test names
4. **Independent Tests**: Tests should not depend on each other
5. **Fast Tests**: Keep tests fast and focused
6. **Meaningful Assertions**: Use specific assertions

### 10.2 Code Examples

```java
@Test
void testCreateProduct_WithValidData_ReturnsCreatedProduct() {
    // Arrange - Set up test data
    ProductDTO productDTO = createTestProductDTO();
    
    // Act - Execute the method under test
    Product result = productService.saveProductDTO(productDTO);
    
    // Assert - Verify the results
    assertNotNull(result);
    assertEquals(productDTO.getName(), result.getName());
    assertEquals(productDTO.getPrice(), result.getPrice());
}
```

---

## 11. Current Test Status

### 11.1 Implemented Tests ✅
- ProductServiceTest (8 test cases)
- ProductControllerTest (7 test cases)
- JwtUtilsTest (7 test cases)

### 11.2 Pending Tests 📋
- UserServiceTest
- SaleServiceTest
- AuthControllerTest
- SaleControllerTest
- Repository tests
- Frontend component tests
- E2E tests

### 11.3 Test Coverage Summary
- **Current Coverage**: ~25% (initial tests)
- **Target Coverage**: 80%
- **Tests Implemented**: 22
- **Tests Pending**: ~100+

---

## 12. Next Steps

1. ✅ Implement remaining service tests
2. ✅ Implement remaining controller tests
3. ✅ Add repository tests
4. ✅ Set up frontend testing framework
5. ✅ Implement component tests
6. ✅ Set up E2E testing
7. ✅ Configure CI/CD pipeline
8. ✅ Generate and review coverage reports

---

## Conclusion

This testing plan provides a comprehensive approach to ensuring the quality and reliability of the Pharmacy Management System. By following this plan, we can achieve high code coverage, catch bugs early, and maintain a robust application.

The implemented tests demonstrate best practices in unit testing, integration testing, and security testing. As the application grows, this testing framework will ensure continued quality and reliability.
