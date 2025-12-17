package com.example.pharmacy.repository;

import java.util.List;
import com.example.pharmacy.entity.Product; // Adding import for Product


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.pharmacy.entity.Sale;
import com.example.pharmacy.entity.SaleItem;

@Repository

public interface SaleItemRepository extends JpaRepository<SaleItem, Long> { 

    //find sales item by sale
    List<SaleItem> findBySale(Sale sale);

    //fing sale item bt product
    List<SaleItem> findByProduct(Product product);

    //find sale items by quantity greater than
    List<SaleItem> findByQuantityGreaterThan(int quantity);

    //custom query to find most sold products
    @Query("SELECT s.product, SUM(s.quantity) as totalQuantity FROM SaleItem s GROUP BY s.product ORDER BY totalQuantity DESC")
    List<Object[]> findMostSoldProducts();
}
