package com.example.pharmacy.service;

import com.example.pharmacy.dto.SupplierDTO;
import com.example.pharmacy.entity.Supplier;
import com.example.pharmacy.repository.SupplierRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SupplierService {
    private static final Logger logger = LoggerFactory.getLogger(SupplierService.class);

    @Autowired
    private SupplierRepository supplierRepository;

    @Transactional(readOnly = true)
    public List<SupplierDTO> getAllSuppliers() {
        try {
            logger.info("Fetching all suppliers");
            List<Supplier> suppliers = supplierRepository.findAll();
            return suppliers.stream()
                .map(supplier -> {
                    SupplierDTO dto = new SupplierDTO();
                    dto.setSupplierId(supplier.getSupplierId());
                    dto.setName(supplier.getName());
                    dto.setContactNumber(supplier.getContactNumber());
                    dto.setEmail(supplier.getEmail());
                    return dto;
                })
                .collect(Collectors.toList());
        } catch (Exception e) {
            logger.error("Error fetching suppliers: {}", e.getMessage(), e);
            throw new RuntimeException("Error fetching suppliers: " + e.getMessage());
        }
    }

    @Transactional
    public SupplierDTO createSupplier(SupplierDTO supplierDTO) {
        try {
            logger.info("Creating supplier: {}", supplierDTO.getName());

            // Validate required fields
            if (supplierDTO.getName() == null || supplierDTO.getName().trim().isEmpty()) {
                throw new RuntimeException("Supplier name is required");
            }
            if (supplierDTO.getContactNumber() == null || supplierDTO.getContactNumber().trim().isEmpty()) {
                throw new RuntimeException("Contact number is required");
            }
            if (supplierDTO.getEmail() == null || supplierDTO.getEmail().trim().isEmpty()) {
                throw new RuntimeException("Email is required");
            }

            Supplier supplier = new Supplier();
            supplier.setName(supplierDTO.getName());
            supplier.setContactNumber(supplierDTO.getContactNumber());
            supplier.setEmail(supplierDTO.getEmail());

            Supplier savedSupplier = supplierRepository.save(supplier);
            SupplierDTO dto = new SupplierDTO();
            dto.setSupplierId(savedSupplier.getSupplierId());
            dto.setName(savedSupplier.getName());
            dto.setContactNumber(savedSupplier.getContactNumber());
            dto.setEmail(savedSupplier.getEmail());
            logger.info("Successfully created supplier with ID: {}", savedSupplier.getSupplierId());
            return dto;
        } catch (Exception e) {
            logger.error("Error creating supplier: {}", e.getMessage(), e);
            throw new RuntimeException("Error creating supplier: " + e.getMessage());
        }
    }

    @Transactional(readOnly = true)
    public SupplierDTO getSupplierById(Long id) {
        try {
            logger.info("Fetching supplier with ID: {}", id);
            Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Supplier not found with id: " + id));
            
            SupplierDTO dto = new SupplierDTO();
            dto.setSupplierId(supplier.getSupplierId());
            dto.setName(supplier.getName());
            dto.setContactNumber(supplier.getContactNumber());
            dto.setEmail(supplier.getEmail());
            return dto;
        } catch (Exception e) {
            logger.error("Error fetching supplier: {}", e.getMessage(), e);
            throw new RuntimeException("Error fetching supplier: " + e.getMessage());
        }
    }

    @Transactional
    public SupplierDTO updateSupplier(Long id, SupplierDTO supplierDTO) {
        try {
            logger.info("Updating supplier with ID: {}", id);

            // Validate required fields
            if (supplierDTO.getName() == null || supplierDTO.getName().trim().isEmpty()) {
                throw new RuntimeException("Supplier name is required");
            }
            if (supplierDTO.getContactNumber() == null || supplierDTO.getContactNumber().trim().isEmpty()) {
                throw new RuntimeException("Contact number is required");
            }
            if (supplierDTO.getEmail() == null || supplierDTO.getEmail().trim().isEmpty()) {
                throw new RuntimeException("Email is required");
            }

            Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Supplier not found with id: " + id));

            supplier.setName(supplierDTO.getName());
            supplier.setContactNumber(supplierDTO.getContactNumber());
            supplier.setEmail(supplierDTO.getEmail());

            Supplier updatedSupplier = supplierRepository.save(supplier);
            SupplierDTO dto = new SupplierDTO();
            dto.setSupplierId(updatedSupplier.getSupplierId());
            dto.setName(updatedSupplier.getName());
            dto.setContactNumber(updatedSupplier.getContactNumber());
            dto.setEmail(updatedSupplier.getEmail());
            logger.info("Successfully updated supplier with ID: {}", updatedSupplier.getSupplierId());
            return dto;
        } catch (Exception e) {
            logger.error("Error updating supplier: {}", e.getMessage(), e);
            throw new RuntimeException("Error updating supplier: " + e.getMessage());
        }
    }

    @Transactional
    public void deleteSupplier(Long id) {
        try {
            logger.info("Deleting supplier with ID: {}", id);
            Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Supplier not found with id: " + id));
            supplierRepository.delete(supplier);
            logger.info("Successfully deleted supplier with ID: {}", id);
        } catch (Exception e) {
            logger.error("Error deleting supplier: {}", e.getMessage(), e);
            throw new RuntimeException("Error deleting supplier: " + e.getMessage());
        }
    }
}