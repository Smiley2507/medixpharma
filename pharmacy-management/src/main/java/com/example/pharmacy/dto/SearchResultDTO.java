package com.example.pharmacy.dto;

import lombok.Data;

@Data
public class SearchResultDTO {
    private String id;
    private String type; // "PRODUCT", "STOCK", "SALE", "SUPPLIER", "USER"
    private String title;
    private String description;
    private String link; // URL to navigate to the item
    private Object data; // Additional data specific to the entity type

    // Constructor for convenience
    public SearchResultDTO(String id, String type, String title, String description, String link, Object data) {
        this.id = id;
        this.type = type;
        this.title = title;
        this.description = description;
        this.link = link;
        this.data = data;
    }
}