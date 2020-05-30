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

	@Test
	void createAccount() throws IOException {
		UserController userController = new UserController();
		assert userController.createAccount("user1", "abc").getMessage().equals("200");
	}

	@Test
	void expense() throws IOException {
//		UserController userController = new UserController();
//		assert userController.login("user1", "abc").getMessage().equals("200");

		ExpensesController controller = new ExpensesController();
		controller.addExpense("user1","Tims", "2020-02-02","3.10");

		System.out.println(controller.getExpenses("user1").get(0).getCost());
	}

	@Test
	void progress() throws IOException {
		ProgressController controller = new ProgressController();

		System.out.println(controller.getProgress("user5"));
	}
}
