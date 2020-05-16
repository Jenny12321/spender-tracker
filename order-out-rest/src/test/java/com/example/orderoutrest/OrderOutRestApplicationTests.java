package com.example.orderoutrest;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import java.io.IOException;

@SpringBootTest
class OrderOutRestApplicationTests {

	@Test
	void contextLoads() {
	}

	@Test
	void loginRightPass() throws IOException {
		UserController userController = new UserController();
		assert userController.login("user1", "abc").getMessage().equals("200");
	}
}
