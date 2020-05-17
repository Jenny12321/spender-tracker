package com.example.objects;

public class ProgressEntity {
    private int percentOrder = 0;
    private double budget = 0.00;
    private double spent = 0.00;
    private int cookCount = 0;
    private int orderCount = 0;

    public ProgressEntity(int percentOrder, double budget, double spent, int cookCount, int orderCount) {
        this.percentOrder = percentOrder;
        this.budget = budget;
        this.spent = spent;
        this.cookCount = cookCount;
        this.orderCount = orderCount;
    }

    public double getBudget() {
        return budget;
    }

    public double getSpent() {
        return spent;
    }

    public int getCookCount() {
        return cookCount;
    }

    public int getOrderCount() {
        return orderCount;
    }

    public int getPercentOrder() {
        return percentOrder;
    }

    public void setSpent(double spent) {
        this.spent = spent;
    }
}
