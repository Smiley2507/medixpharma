# Design Patterns in Pharmacy Management System

## Overview
This document identifies and explains the design patterns implemented in the Pharmacy Management System. Design patterns are reusable solutions to common problems in software design. Our application demonstrates several industry-standard patterns.

---

## 1. Repository Pattern

### Description
The Repository Pattern provides an abstraction layer between the business logic and data access logic. It centralizes data access logic and provides a cleaner separation of concerns.

### Implementation in Our Application
All database operations are handled through repository interfaces that extend `JpaRepository`.

### Example Code
```java
// Location: com/example/pharmacy/repository/ProductRepository.java
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByNameContainingIgnoreCase(String keyword);
    List<Product> findBySupplier(Supplier supplier);
    List<Product> findByPriceBetween(BigDecimal minPrice, BigDecimal maxPrice);
}
```

### Benefits
- **Centralized Data Access**: All database queries are in one place
- **Testability**: Easy to mock repositories for unit testing
- **Maintainability**: Changes to data access logic don't affect business logic
- **Abstraction**: Business logic doesn't need to know about database implementation

### Where Used
- `ProductRepository`
- `UserRepository`
- `SaleRepository`
- `StockRepository`
- `SupplierRepository`
- `OtpVerificationRepository`
- `RoleRepository`
- `SaleItemRepository`

---

## 2. Data Transfer Object (DTO) Pattern

### Description
The DTO Pattern is used to transfer data between different layers of the application. DTOs help decouple the internal domain model from the external API representation.

### Implementation in Our Application
We use DTOs to transfer data between the controller and service layers, and to shape the API responses.

### Example Code
```java
// Location: com/example/pharmacy/dto/ProductDTO.java
public class ProductDTO {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private String category;
    private Long supplierId;
    private String supplierName;
    // Getters and setters...
}
```

### Benefits
- **Security**: Prevents exposing sensitive entity fields
- **Performance**: Reduces data transfer by including only necessary fields
- **Flexibility**: API structure can change without affecting entities
- **Validation**: Can apply different validation rules for different operations

### Where Used
- `ProductDTO`
- `SaleDTO`
- `SaleItemDTO`
- `StockDTO`
- `SupplierDTO`
- `SearchResultDTO`
- `LoginRequest`
- `SignupRequest`
- `JwtResponse`
- `MessageResponse`

---

## 3. Dependency Injection Pattern (IoC - Inversion of Control)

### Description
Dependency Injection is a design pattern where objects receive their dependencies from external sources rather than creating them. Spring Framework implements this through its IoC container.

### Implementation in Our Application
Spring automatically injects dependencies using `@Autowired` or constructor injection.

### Example Code
```java
// Location: com/example/pharmacy/service/ProductService.java
@Service
public class ProductService {
    private final ProductRepository productRepository;
    private final SupplierRepository supplierRepository;
    
    @Autowired
    public ProductService(ProductRepository productRepository, 
                         SupplierRepository supplierRepository) {
        this.productRepository = productRepository;
        this.supplierRepository = supplierRepository;
    }
    // Service methods...
}
```

### Benefits
- **Loose Coupling**: Components don't create their dependencies
- **Testability**: Easy to inject mock dependencies for testing
- **Maintainability**: Dependencies can be changed without modifying the class
- **Reusability**: Components can be reused with different implementations

### Where Used
Throughout the entire application:
- All `@Service` classes
- All `@Controller` classes
- `SecurityConfig`
- `JwtUtils`
- `AuthTokenFilter`

---

## 4. MVC (Model-View-Controller) Pattern

### Description
MVC separates application logic into three interconnected components: Model (data), View (presentation), and Controller (business logic).

### Implementation in Our Application
- **Model**: Entity classes (`Product`, `User`, `Sale`, etc.)
- **View**: React frontend (separate application)
- **Controller**: REST controllers that handle HTTP requests

### Example Code
```java
// Location: com/example/pharmacy/controller/ProductController.java
@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:5173")
public class ProductController {
    @Autowired
    private ProductService productService;
    
    @GetMapping
    public ResponseEntity<List<ProductDTO>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }
    
    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody ProductDTO productDTO) {
        return ResponseEntity.ok(productService.saveProductDTO(productDTO));
    }
}
```

### Benefits
- **Separation of Concerns**: Each layer has a specific responsibility
- **Parallel Development**: Frontend and backend can be developed independently
- **Maintainability**: Changes in one layer don't affect others
- **Scalability**: Each layer can be scaled independently

### Where Used
- **Controllers**: `ProductController`, `UserController`, `SaleController`, `AuthController`, etc.
- **Services**: `ProductService`, `UserService`, `SaleService`, etc.
- **Models**: `Product`, `User`, `Sale`, `Stock`, `Supplier`, etc.

---

## 5. Singleton Pattern

### Description
The Singleton Pattern ensures a class has only one instance and provides a global point of access to it.

### Implementation in Our Application
Spring beans are singletons by default. Each `@Component`, `@Service`, `@Repository`, and `@Controller` is created once per application context.

### Example Code
```java
// Location: com/example/pharmacy/security/JwtUtils.java
@Component
public class JwtUtils {
    private static final Logger logger = LoggerFactory.getLogger(JwtUtils.class);
    
    @Value("${pharmacy.app.jwtSecret}")
    private String jwtSecret;
    
    @Value("${pharmacy.app.jwtExpirationMs}")
    private int jwtExpirationMs;
    
    // JWT utility methods...
}
```

### Benefits
- **Resource Efficiency**: Only one instance exists in memory
- **Global Access**: Can be injected anywhere in the application
- **State Management**: Maintains state across the application
- **Configuration**: Loads configuration once

### Where Used
All Spring-managed beans:
- `JwtUtils`
- `SecurityConfig`
- All services, repositories, and controllers
- `EmailService`
- `AuthTokenFilter`

---

## 6. Proxy Pattern

### Description
The Proxy Pattern provides a surrogate or placeholder for another object to control access to it.

### Implementation in Our Application
Spring uses proxies extensively for:
1. **Security**: Method-level security through `@PreAuthorize`
2. **Transactions**: `@Transactional` annotations
3. **AOP**: Aspect-Oriented Programming features

### Example Code
```java
// Location: com/example/pharmacy/security/AuthTokenFilter.java
@Component
public class AuthTokenFilter extends OncePerRequestFilter {
    @Autowired
    private JwtUtils jwtUtils;
    
    @Autowired
    private UserDetailsServiceImpl userDetailsService;
    
    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                   HttpServletResponse response, 
                                   FilterChain filterChain) {
        // Intercepts requests and validates JWT tokens
        // Acts as a proxy between client and application
    }
}
```

### Benefits
- **Security**: Controls access to sensitive operations
- **Lazy Loading**: Can defer object creation
- **Logging**: Can add logging without changing original code
- **Caching**: Can cache results transparently

### Where Used
- `AuthTokenFilter` - Proxies HTTP requests for authentication
- `@Transactional` methods - Spring creates proxies for transaction management
- Spring Security filter chain - Multiple proxies for security
- JPA lazy loading - Hibernate creates proxies for lazy-loaded entities

---

## 7. Factory Pattern

### Description
The Factory Pattern provides an interface for creating objects without specifying their exact class.

### Implementation in Our Application
Spring's `BeanFactory` and `ApplicationContext` act as factories for creating and managing beans.

### Example Code
```java
// Location: com/example/pharmacy/config/SecurityConfig.java
@Configuration
public class SecurityConfig {
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }
    
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) 
            throws Exception {
        return authConfig.getAuthenticationManager();
    }
}
```

### Benefits
- **Flexibility**: Can change implementations without changing client code
- **Encapsulation**: Object creation logic is centralized
- **Reusability**: Factory methods can be reused
- **Testability**: Easy to provide test implementations

### Where Used
- `SecurityConfig` - Creates security-related beans
- Spring's `@Bean` methods - Factory methods for creating beans
- `UserDetailsServiceImpl.loadUserByUsername()` - Creates `UserDetails` objects
- Repository methods - Create entity instances

---

## 8. Builder Pattern

### Description
The Builder Pattern constructs complex objects step by step, allowing for different representations using the same construction process.

### Implementation in Our Application
Used implicitly through Lombok's `@Builder` annotation and JWT token construction.

### Example Code
```java
// Location: com/example/pharmacy/security/JwtUtils.java
public String generateJwtToken(Authentication authentication) {
    UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();
   
    Map<String, Object> claims = new HashMap<>();
    // ... populate claims
    
    return Jwts.builder()
            .setClaims(claims)
            .setSubject(userPrincipal.getUsername())
            .setIssuedAt(new Date())
            .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs))
            .signWith(getSigningKey())
            .compact();
}
```

### Benefits
- **Readability**: Step-by-step construction is easy to understand
- **Flexibility**: Can create different representations
- **Immutability**: Can create immutable objects
- **Validation**: Can validate during construction

### Where Used
- JWT token creation in `JwtUtils`
- Entity builders (if using Lombok `@Builder`)
- HTTP response builders in controllers
- Query builders in repositories

---

## 9. Strategy Pattern

### Description
The Strategy Pattern defines a family of algorithms, encapsulates each one, and makes them interchangeable.

### Implementation in Our Application
Used in authentication strategies and password encoding.

### Example Code
```java
// Location: com/example/pharmacy/config/SecurityConfig.java
@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder(); // Can be changed to other encoders
}

// Different authentication strategies can be plugged in
@Bean
public DaoAuthenticationProvider authenticationProvider() {
    DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
    authProvider.setUserDetailsService(userDetailsService);
    authProvider.setPasswordEncoder(passwordEncoder());
    return authProvider;
}
```

### Benefits
- **Flexibility**: Algorithms can be switched at runtime
- **Open/Closed Principle**: New strategies can be added without modifying existing code
- **Testability**: Each strategy can be tested independently
- **Maintainability**: Algorithm changes don't affect clients

### Where Used
- Password encoding strategies (`BCryptPasswordEncoder`)
- Authentication strategies (`DaoAuthenticationProvider`)
- Search strategies in `SearchService`
- Validation strategies

---

## 10. Observer Pattern

### Description
The Observer Pattern defines a one-to-many dependency between objects so that when one object changes state, all its dependents are notified.

### Implementation in Our Application
Spring's event handling mechanism and reactive components.

### Example Code
```java
// Implicit in Spring Security's authentication events
// When authentication succeeds/fails, multiple listeners can be notified
// Also used in JPA entity listeners for audit trails
```

### Benefits
- **Loose Coupling**: Subjects and observers are loosely coupled
- **Dynamic Relationships**: Observers can be added/removed at runtime
- **Broadcast Communication**: One event can notify multiple observers
- **Reusability**: Observers can be reused with different subjects

### Where Used
- Spring Security authentication events
- JPA entity lifecycle events
- Application events (if implemented)
- Email notifications on user registration

---

## Summary Table

| Pattern | Purpose | Key Components | Benefits |
|---------|---------|----------------|----------|
| Repository | Data Access | `*Repository` interfaces | Centralized data access, testability |
| DTO | Data Transfer | `*DTO` classes | Security, performance, flexibility |
| Dependency Injection | Object Creation | `@Autowired`, constructors | Loose coupling, testability |
| MVC | Application Structure | Controllers, Services, Entities | Separation of concerns |
| Singleton | Single Instance | Spring beans | Resource efficiency |
| Proxy | Access Control | `AuthTokenFilter`, AOP | Security, logging, transactions |
| Factory | Object Creation | `@Bean` methods | Flexibility, encapsulation |
| Builder | Complex Construction | JWT builder, Lombok | Readability, immutability |
| Strategy | Algorithm Selection | Password encoders | Flexibility, maintainability |
| Observer | Event Notification | Spring events | Loose coupling, broadcast |

---

## Conclusion

The Pharmacy Management System demonstrates professional software engineering practices by implementing multiple design patterns. These patterns work together to create a maintainable, scalable, and testable application that follows industry best practices and SOLID principles.

Each pattern serves a specific purpose and contributes to the overall quality of the codebase. Understanding these patterns is crucial for maintaining and extending the application in the future.
