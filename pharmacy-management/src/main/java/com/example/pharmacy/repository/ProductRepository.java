package com.example.pharmacy.repository;
import com.example.pharmacy.entity.Product;
import com.example.pharmacy.entity.Supplier;
import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;




@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    //Find product by name
    List<Product> findByName(String name);

    //find product by name (contain)
    List<Product> findByNameContaining(String name);

    //find product by generic name
    List<Product> findByGenericName(String genericName);

    //find by supplier
    List<Product> findBySupplier(Supplier supplier);

    //find by price range
    List<Product> findByPriceBetween(BigDecimal minPrice, BigDecimal maxPrice);

    //find by by manufacturer
    List<Product> findByManufacturer(String manufacturer);

    List<Product> findByNameContainingIgnoreCase(String name);
}

    
