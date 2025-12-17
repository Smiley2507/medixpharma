package com.example.pharmacy.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.pharmacy.entity.Product;
import com.example.pharmacy.entity.Stock;

@Repository
public interface StockRepository extends JpaRepository<Stock, Long> {
    // Find by product, ordered by expiry date (FIFO)
    @Query("SELECT s FROM Stock s JOIN FETCH s.product WHERE s.product = :product ORDER BY s.expiryDate ASC")
    List<Stock> findByProduct(@Param("product") Product product);

    // Find by batch number
    @Query("SELECT s FROM Stock s JOIN FETCH s.product WHERE s.batchNumber = :batchNumber")
    List<Stock> findByBatchNumber(@Param("batchNumber") String batchNumber);
    
    // Find by expired stock
    @Query("SELECT s FROM Stock s JOIN FETCH s.product WHERE s.expiryDate < :date")
    List<Stock> findByExpiryDateBefore(@Param("date") LocalDate date);

    // Find by expiring between (String parameters for API)
    @Query("SELECT s FROM Stock s JOIN FETCH s.product WHERE s.expiryDate BETWEEN :start AND :end")
    List<Stock> findByExpiryDateBetween(@Param("start") String start, @Param("end") String end);

    // Find by expiring between (LocalDate parameters)
    @Query("SELECT s FROM Stock s JOIN FETCH s.product WHERE s.expiryDate BETWEEN :start AND :end")
    List<Stock> findByExpiryDateBetween(@Param("start") LocalDate start, @Param("end") LocalDate end);

    // Find stock with quantity less than or equal to specified value
    @Query("SELECT s FROM Stock s JOIN FETCH s.product WHERE s.quantity <= :threshold")
    List<Stock> findByQuantityLessThanEqual(@Param("threshold") int threshold);

    // Custom query to get total quantity of a product across all batches
    @Query("SELECT COALESCE(SUM(s.quantity), 0) FROM Stock s WHERE s.product.productId = :productId")
    Integer getTotalQuantity(@Param("productId") Long productId);

    List<Stock> findByProductNameContainingIgnoreCase(String productName);

}