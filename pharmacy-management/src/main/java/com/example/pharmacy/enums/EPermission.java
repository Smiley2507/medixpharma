package com.example.pharmacy.enums;

public enum EPermission {
    // PRODUCT permissions
    PRODUCT_READ,
    PRODUCT_CREATE,
    PRODUCT_UPDATE,
    PRODUCT_DELETE,
    
    // STOCK permissions
    STOCK_READ,
    STOCK_UPDATE,
    STOCK_IMPORT,
    STOCK_EXPORT,
    
    // Sales permissions
    SALE_CREATE,
    SALE_READ,
    SALE_UPDATE,
    SALE_DELETE,
    
    
    // Reporting permissions
    REPORT_SALES,
    REPORT_STOCK,
    
    // User management permissions
    USER_READ,
    USER_CREATE,
    USER_UPDATE,
    USER_DELETE
}
