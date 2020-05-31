package com.example.orderoutrest;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class UserTest {
    @Test
    void loginUser() {
        UserController userController = new UserController();
        assert userController.login("user1", "abc").getMessage().equals("200");
    }

    @Test
    void accountExists() {
        UserController userController = new UserController();
        assert userController.createAccount("user1", "abc").getMessage().equals("User already exists");
    }
}
