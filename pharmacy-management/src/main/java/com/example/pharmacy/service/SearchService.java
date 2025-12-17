package com.example.pharmacy.service;

import com.example.pharmacy.dto.SearchResultDTO;
import com.example.pharmacy.entity.Stock;
import com.example.pharmacy.entity.Sale;
import com.example.pharmacy.entity.Supplier;
import com.example.pharmacy.entity.User;
import com.example.pharmacy.repository.StockRepository;
import com.example.pharmacy.repository.SaleRepository;
import com.example.pharmacy.repository.SupplierRepository;
import com.example.pharmacy.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class SearchService {
    private static final Logger logger = LoggerFactory.getLogger(SearchService.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StockRepository stockRepository;

    @Autowired
    private SaleRepository saleRepository;

    @Autowired
    private SupplierRepository supplierRepository;

    public List<SearchResultDTO> search(String query) {
        List<SearchResultDTO> results = new ArrayList<>();

        // Search Users
        List<User> users = userRepository.findByFullNameContainingIgnoreCase(query);
        for (User user : users) {
            results.add(new SearchResultDTO(
                user.getId().toString(),
                "USER",
                user.getFullName(),
                user.getEmail(),
                "/users/update/" + user.getId(),
                null
            ));
        }

        // Search Stocks
        List<Stock> stocks = stockRepository.findByProductNameContainingIgnoreCase(query);
        for (Stock stock : stocks) {
            results.add(new SearchResultDTO(
                stock.getStockId().toString(),
                "STOCK",
                stock.getProduct().getName(),
                "Quantity: " + stock.getQuantity(),
                "/stocks",
                null
            ));
        }

        // Search Sales
        List<Sale> sales = saleRepository.findByProductNameContainingIgnoreCase(query);
        for (Sale sale : sales) {
            results.add(new SearchResultDTO(
                sale.getSaleId().toString(),
                "SALE",
                sale.getCustomerName(),
                "Total: " + sale.getTotalAmount(),
                "/sales",
                null
            ));
        }

        // Search Suppliers
        List<Supplier> suppliers = supplierRepository.findByNameContainingIgnoreCase(query);
        for (Supplier supplier : suppliers) {
            results.add(new SearchResultDTO(
                supplier.getSupplierId().toString(),
                "SUPPLIER",
                supplier.getName(),
                supplier.getEmail(),
                "/suppliers",
                null
            ));
        }

        return results;
    }
}