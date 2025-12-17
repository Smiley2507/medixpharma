package com.example.pharmacy.repository;

import java.util.List;
import com.example.pharmacy.entity.Supplier; // Adding import for Supplier


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository

public interface SupplierRepository extends JpaRepository<Supplier, Long> {
    //find by name
    List<Supplier> findByName(String name);

    //find suppliers by name containing
    List<Supplier> findByNameContaining(String name);

    //find suppliers by email
    Supplier findByEmail(String email);

    //find suppliers by contact number
    Supplier findByContactNumber(String contactNumber);

    List<Supplier> findByNameContainingIgnoreCase(String name);
}
