# Multi-stage build for Spring Boot application
FROM maven:3.9-eclipse-temurin-21 AS build

# Set working directory
WORKDIR /app

# Copy pom.xml and source code
COPY pom.xml .
COPY src ./src

# Build the application (Maven will download dependencies automatically)
# Skip test compilation and execution for Docker build
RUN mvn clean package -DskipTests -Dmaven.test.skip=true

# Production stage
FROM eclipse-temurin:21-jre-alpine

# Set working directory
WORKDIR /app

# Copy the built jar from build stage
COPY --from=build /app/target/*.jar app.jar

# Expose port
EXPOSE 8082

# Set environment variables (can be overridden)
ENV SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/pharmacymanagement
ENV SPRING_DATASOURCE_USERNAME=celse
ENV SPRING_DATASOURCE_PASSWORD=123456

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
