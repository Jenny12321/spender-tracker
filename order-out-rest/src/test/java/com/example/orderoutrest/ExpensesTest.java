package com.example.orderoutrest;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import java.io.IOException;

@SpringBootTest
public class ExpensesTest {
    @Test
    void addExpense() {
        ExpensesController controller = new ExpensesController();
        controller.addExpense("user1","Tims", "2020-02-02","3.10");

        assert controller.getExpenses("user1").get(0).getCost() == 3.1;
    }
}
