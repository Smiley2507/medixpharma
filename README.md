# Pharmacy Management System

A comprehensive full-stack pharmacy management system built with Spring Boot and React, featuring secure authentication, inventory management, sales tracking, and supplier management.

![Java](https://img.shields.io/badge/Java-21-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.3-brightgreen)
![React](https://img.shields.io/badge/React-18-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue)
![Docker](https://img.shields.io/badge/Docker-Ready-blue)

## 📋 Table of Contents
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Design Patterns](#design-patterns)
- [Getting Started](#getting-started)
- [Docker Deployment](#docker-deployment)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### Core Functionality
- 🔐 **Secure Authentication**: JWT-based authentication with OTP verification
- 💊 **Product Management**: Complete CRUD operations for pharmaceutical products
- 📦 **Inventory Management**: Real-time stock tracking and low-stock alerts
- 💰 **Sales Management**: Point-of-sale system with receipt generation
- 🏢 **Supplier Management**: Manage supplier information and relationships
- 📊 **Dashboard Analytics**: Real-time statistics and insights
- 🔍 **Advanced Search**: Multi-criteria search across products and sales
- 👥 **User Management**: Role-based access control (Admin, User)

### Security Features
- JWT token-based authentication
- Password encryption with BCrypt
- OTP verification for login
- Role-based authorization
- CORS configuration
- SQL injection prevention
- XSS protection

## 🛠 Technology Stack

### Backend
- **Framework**: Spring Boot 3.2.3
- **Language**: Java 21
- **Database**: PostgreSQL 16
- **Security**: Spring Security + JWT
- **ORM**: Spring Data JPA / Hibernate
- **Build Tool**: Maven
- **API Documentation**: SpringDoc OpenAPI (Swagger)
- **Email**: Spring Mail
- **Testing**: JUnit 5, Mockito, MockMvc

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: CSS3
- **HTTP Client**: Axios
- **Routing**: React Router

### DevOps
- **Containerization**: Docker & Docker Compose
- **Database**: PostgreSQL (containerized)
- **Web Server**: Nginx (for frontend)
- **Version Control**: Git & GitHub

## 🏗 Architecture

The application follows a **layered architecture** pattern:

```
┌─────────────────────────────────────────┐
│          React Frontend (Vite)          │
│         (Port 80 - Nginx)               │
└─────────────────┬───────────────────────┘
                  │ HTTP/REST API
┌─────────────────▼───────────────────────┐
│      Spring Boot Backend (Port 8082)    │
│  ┌─────────────────────────────────┐    │
│  │   Controllers (REST API)        │    │
│  └──────────────┬──────────────────┘    │
│  ┌──────────────▼──────────────────┐    │
│  │   Services (Business Logic)     │    │
│  └──────────────┬──────────────────┘    │
│  ┌──────────────▼──────────────────┐    │
│  │   Repositories (Data Access)    │    │
│  └──────────────┬──────────────────┘    │
└─────────────────┼───────────────────────┘
                  │ JDBC
┌─────────────────▼───────────────────────┐
│      PostgreSQL Database (Port 5432)    │
└─────────────────────────────────────────┘
```

## 🎨 Design Patterns

This project implements multiple industry-standard design patterns:

1. **Repository Pattern** - Data access abstraction
2. **DTO Pattern** - Data transfer between layers
3. **Dependency Injection** - Loose coupling via Spring IoC
4. **MVC Pattern** - Separation of concerns
5. **Singleton Pattern** - Spring bean management
6. **Proxy Pattern** - Security and AOP
7. **Factory Pattern** - Bean creation
8. **Builder Pattern** - Complex object construction
9. **Strategy Pattern** - Authentication strategies
10. **Observer Pattern** - Event handling

📖 **Detailed Documentation**: See [DESIGN_PATTERNS.md](DESIGN_PATTERNS.md) for comprehensive explanations with code examples.

## 🚀 Getting Started

### Prerequisites
- Java 21 or higher
- Node.js 18 or higher
- PostgreSQL 16
- Maven 3.9+
- Docker & Docker Compose (for containerized deployment)

### Local Development Setup

#### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/pharmacy-management-system.git
cd pharmacy-management-system
```

#### 2. Database Setup
```bash
# Create PostgreSQL database
createdb pharmacymanagement

# Or using psql
psql -U postgres
CREATE DATABASE pharmacymanagement;
```

#### 3. Backend Setup
```bash
cd pharmacy-management

# Update application.properties with your database credentials
# src/main/resources/application.properties

# Build and run
./mvnw clean install
./mvnw spring-boot:run
```

The backend will start on `http://localhost:8082`

#### 4. Frontend Setup
```bash
cd pharmacy_frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will start on `http://localhost:5173`

## 🐳 Docker Deployment

### Quick Start with Docker Compose

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Stop and remove volumes (clean slate)
docker-compose down -v
```

### Services
- **Frontend**: http://localhost (port 80)
- **Backend**: http://localhost:8082
- **Database**: localhost:5432

### Docker Architecture
```yaml
services:
  postgres:     # PostgreSQL database
  backend:      # Spring Boot application
  frontend:     # React app with Nginx
```

### Environment Variables
You can customize the deployment by setting environment variables:

```bash
# Database
POSTGRES_DB=pharmacymanagement
POSTGRES_USER=celse
POSTGRES_PASSWORD=123456

# Backend
SERVER_PORT=8082
SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/pharmacymanagement
```

## 📚 API Documentation

### Swagger UI
Once the backend is running, access the API documentation at:
- **Swagger UI**: http://localhost:8082/swagger-ui.html
- **OpenAPI JSON**: http://localhost:8082/v3/api-docs

### Main Endpoints

#### Authentication
```
POST   /api/users/register          - Register new user
POST   /api/users/login              - Initiate login (send OTP)
POST   /api/users/verify-otp         - Verify OTP and get JWT
POST   /api/users/logout             - Logout user
```

#### Products
```
GET    /api/products                 - Get all products
GET    /api/products/{id}            - Get product by ID
POST   /api/products                 - Create new product
PUT    /api/products/{id}            - Update product
DELETE /api/products/{id}            - Delete product
GET    /api/products/search          - Search products
```

#### Sales
```
GET    /api/sales                    - Get all sales
GET    /api/sales/{id}               - Get sale by ID
POST   /api/sales                    - Create new sale
DELETE /api/sales/{id}               - Delete sale
```

#### Suppliers
```
GET    /api/suppliers                - Get all suppliers
GET    /api/suppliers/{id}           - Get supplier by ID
POST   /api/suppliers                - Create new supplier
PUT    /api/suppliers/{id}           - Update supplier
DELETE /api/suppliers/{id}           - Delete supplier
```

#### Stock
```
GET    /api/stock                    - Get all stock items
GET    /api/stock/{id}               - Get stock by ID
POST   /api/stock                    - Add stock
PUT    /api/stock/{id}               - Update stock
```

## 🧪 Testing

### Backend Tests

```bash
cd pharmacy-management

# Run all tests
./mvnw test

# Run specific test class
./mvnw test -Dtest=ProductServiceTest

# Run tests with coverage
./mvnw test jacoco:report

# View coverage report
open target/site/jacoco/index.html
```

### Test Coverage
- **Unit Tests**: Service layer, Security utilities
- **Integration Tests**: REST API endpoints, Controllers
- **Security Tests**: JWT authentication, Authorization

📖 **Detailed Testing Plan**: See [TESTING_PLAN.md](TESTING_PLAN.md)

### Current Test Status
- ✅ ProductServiceTest (8 test cases)
- ✅ ProductControllerTest (7 test cases)
- ✅ JwtUtilsTest (7 test cases)
- **Total**: 22+ test cases implemented

## 📁 Project Structure

```
pharmacy-management-system/
├── pharmacy-management/          # Backend (Spring Boot)
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/example/pharmacy/
│   │   │   │   ├── config/          # Configuration classes
│   │   │   │   ├── controller/      # REST controllers
│   │   │   │   ├── dto/             # Data Transfer Objects
│   │   │   │   ├── entity/          # JPA entities
│   │   │   │   ├── repository/      # Data repositories
│   │   │   │   ├── security/        # Security components
│   │   │   │   ├── service/         # Business logic
│   │   │   │   └── exception/       # Exception handling
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/                    # Unit & integration tests
│   ├── Dockerfile
│   └── pom.xml
│
├── pharmacy_frontend/            # Frontend (React)
│   ├── src/
│   │   ├── components/          # React components
│   │   ├── pages/               # Page components
│   │   ├── services/            # API services
│   │   ├── utils/               # Utility functions
│   │   └── App.jsx
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
│
├── docker-compose.yml           # Docker orchestration
├── DESIGN_PATTERNS.md           # Design patterns documentation
├── TESTING_PLAN.md              # Testing strategy
└── README.md                    # This file
```

## 🔒 Security Best Practices

1. **Authentication**: JWT tokens with expiration
2. **Password Storage**: BCrypt hashing
3. **SQL Injection**: Parameterized queries via JPA
4. **XSS Protection**: Input validation and sanitization
5. **CORS**: Configured for specific origins
6. **HTTPS**: Recommended for production
7. **Environment Variables**: Sensitive data in env vars

## 🌟 Best Programming Practices

This project follows Google's coding standards and industry best practices:

- ✅ **Clean Code**: Meaningful names, small functions, clear comments
- ✅ **SOLID Principles**: Single responsibility, dependency inversion
- ✅ **DRY**: Don't Repeat Yourself
- ✅ **Separation of Concerns**: Layered architecture
- ✅ **Error Handling**: Global exception handler
- ✅ **Logging**: Structured logging with SLF4J
- ✅ **Code Organization**: Logical package structure
- ✅ **Documentation**: Comprehensive JavaDoc and comments
- ✅ **Version Control**: Clear commit messages, branching strategy

## 📊 Database Schema

### Main Entities
- **Users**: User accounts with roles
- **Products**: Pharmaceutical products
- **Suppliers**: Product suppliers
- **Stock**: Inventory tracking
- **Sales**: Sales transactions
- **SaleItems**: Individual sale line items
- **Roles**: User roles (Admin, User)
- **OtpVerification**: OTP codes for authentication

📖 **ERD Diagram**: See `Medix Pharma ERD.png`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- **Your Name** - *Initial work*

## 🙏 Acknowledgments

- Spring Boot team for the excellent framework
- React team for the powerful UI library
- PostgreSQL community
- All contributors and supporters

## 📞 Support

For support, email your-email@example.com or open an issue in the repository.

---

**Made with ❤️ using Spring Boot and React**
