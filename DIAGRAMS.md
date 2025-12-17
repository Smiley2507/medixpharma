# System Diagrams - Pharmacy Management System

This document contains the structural and behavioral diagrams for the Pharmacy Management System. You can use these descriptions and Mermaid code to create professional diagrams for your presentation.

---

## 1. Use Case Diagram

The Use Case Diagram describes the functional requirements of the system from the perspective of different users.

### Mermaid Code
```mermaid
useCaseDiagram
    actor Admin
    actor Staff
    actor User

    package "Pharmacy Management System" {
        usecase "Login & Authentication" as UC1
        usecase "Manage Products" as UC2
        usecase "Monitor Inventory" as UC3
        usecase "Process Sales" as UC4
        usecase "Manage Suppliers" as UC5
        usecase "Generate Reports" as UC6
        usecase "Manage Users" as UC7
        usecase "View Personal Profile" as UC8
    }

    User --> UC1
    User --> UC8

    Staff --> UC1
    Staff --> UC2
    Staff --> UC3
    Staff --> UC4
    Staff --> UC8

    Admin --> UC1
    Admin --> UC2
    Admin --> UC3
    Admin --> UC4
    Admin --> UC5
    Admin --> UC6
    Admin --> UC7
    Admin --> UC8
```

---

## 2. Data Flow Diagram (Level 0 - Context Diagram)

The Data Flow Diagram (DFD) maps out the flow of information for the pharmacy management process.

### Mermaid Code
```mermaid
graph TD
    User((User/Staff/Admin))
    System[Pharmacy Management System]
    Database[(PostgreSQL Database)]
    EmailService[Gmail SMTP Service]

    User -- "Login Credentials" --> System
    User -- "Sale Requests" --> System
    User -- "Product Data" --> System

    System -- "OTP Email" --> EmailService
    EmailService -- "Email Notification" --> User

    System -- "Query/Update" --> Database
    Database -- "Data Results" --> System

    System -- "Dashboard/Reports" --> User
    System -- "Sale Receipt" --> User
```

---

## 3. Sequence Diagram (User Login with OTP)

This diagram shows the interaction between components during a secure login session.

### Mermaid Code
```mermaid
sequenceDiagram
    participant U as User
    participant F as React Frontend
    participant B as Spring Boot Backend
    participant D as Database
    participant E as Email Service

    U->>F: Enter email/password
    F->>B: POST /api/users/login (Credentials)
    B->>D: Find user and verify password
    D-->>B: User details
    B->>B: Generate OTP
    B->>D: Save OTP & Expiration
    B->>E: Send OTP email
    E-->>U: Receive OTP code
    B-->>F: 200 OK (OTP Sent)
    F-->>U: Show OTP verification screen

    U->>F: Enter OTP
    F->>B: POST /api/users/verify-otp (OTP)
    B->>D: Validate OTP
    D-->>B: Valid/Invalid
    B->>B: Generate JWT Token
    B-->>F: 200 OK (JWT Token + User Info)
    F->>F: Save token to localStorage
    F-->>U: Redirect to Dashboard
```

---

## 4. Activity Diagram (Processing a Sale)

The Activity Diagram shows the step-by-step workflow of a business process.

### Mermaid Code
```mermaid
stateDiagram-v2
    [*] --> SelectProducts: Start Sale
    SelectProducts --> ValidateStock: Check Availability
    
    state ValidateStock <<choice>>
    ValidateStock --> StockAvailable: In Stock
    ValidateStock --> OutOfStock: Low Stock Alert
    
    OutOfStock --> SelectProducts: Adjust Quantity
    
    StockAvailable --> CalculateTotal: Add to Cart
    CalculateTotal --> ConfirmSale: Submit Transaction
    
    ConfirmSale --> UpdateDatabase: Finalize
    UpdateDatabase --> GenerateReceipt: Success
    UpdateDatabase --> DeductStock: Update Inventory
    
    GenerateReceipt --> [*]: End Sale
    DeductStock --> [*]
```

---

## 5. System Architecture Diagram

This diagram shows the physical/logical components of the Dockerized environment.

### Mermaid Code
```mermaid
graph LR
    subgraph "Client Side"
        Browser[Web Browser]
    end

    subgraph "Docker Environment (Production)"
        subgraph "Frontend Container (Nginx)"
            React[React App]
            Nginx[Nginx Proxy]
        end

        subgraph "Backend Container (Java 21)"
            Spring[Spring Boot App]
            Security[Spring Security]
            JPA[Data JPA / Hibernate]
        end

        subgraph "Database Container (Postgres 16)"
            DB[(PostgreSQL)]
        end
    end

    Browser -- "HTTP Port 80" --> Nginx
    Nginx -- "Static Files" --> React
    Nginx -- "/api Proxy" --> Spring
    Spring -- "Auth/Business Logic" --> Security
    Security -- "Data Access" --> JPA
    JPA -- "JDBC Port 5432" --> DB
```

---

## Instructions for Presentation

1. **Use Mermaid Live Editor**: Go to [mermaid.live](https://mermaid.live/) and paste the code segments above.
2. **Export as Image**: Download the resulting diagrams as PNG or SVG.
3. **Paste in Slides**: Insert these images into your PowerPoint/Google Slides presentation.
4. **Explain the Flow**: During the presentation, use these diagrams to explain how the system works internally.
