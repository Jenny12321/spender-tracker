package com.example.objects;

public class ExpenseEntity {
    private String id;
    private String vendor;
    private String date;
    private double cost;

    public ExpenseEntity(String id, String vendor, String date, double cost) {
        this.id = id;
        this.vendor = vendor;
        this.date = date;
        this.cost = cost;
    }

    public String getVendor() {
        return vendor;
    }

    public double getCost() {
        return cost;
    }

    public String getDate() {
        return date;
    }
}
