package com.example.pharmacy.repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.pharmacy.entity.Sale;

@Repository
public interface SaleRepository extends JpaRepository<Sale, Long> {
    //find by customer name
    List<Sale> findByCustomerName(String customerName);

    //fing by date
    List<Sale> findBySaleDate(LocalDate saleDate);

    //find sales betwen dates
    List<Sale> findBySaleDateBetween(LocalDate startDate, LocalDate endDate);

    //fid by payment method
    List<Sale> findByPaymentMethod(String paymentMethod);

    //find salaes with total amount greater than specified value
    List<Sale> findByTotalAmountGreaterThan(BigDecimal amount);

    @Query("SELECT s FROM Sale s JOIN s.saleItems si JOIN si.product p WHERE p.name LIKE %:query%")
    List<Sale> findByProductNameContainingIgnoreCase(@Param("query") String query);
}
