package com.example.orderoutrest;

import com.example.objects.ExpenseEntity;
import com.example.restservices.EnvironmentConfig;
import com.example.tables.Expenses;
import org.jooq.*;
import org.jooq.conf.ParamType;
import org.jooq.impl.DSL;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.UUID;

import static org.jooq.impl.DSL.field;
import static org.jooq.impl.DSL.table;

@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController
public class ExpensesController {

    // -------------------------- POST --------------------------

    @PostMapping("/addExpense")
    public static String addExpense(@RequestParam(value="user") String user,
                                    @RequestParam(value = "vendor") String vendor,
                                    @RequestParam(value = "date") String date,
                                    @RequestParam(value = "cost") String cost) {
        EnvironmentConfig env = new EnvironmentConfig();

        final String uuid = UUID.randomUUID().toString().replace("-", "");

        ExpenseEntity expense = new ExpenseEntity(uuid, vendor, date, Double.parseDouble(cost));

        try (Connection connection = DriverManager.getConnection(env.URL, env.props)) {
            System.out.println("Connected to PostgreSQL database!");

            setTableName(user);

            DSLContext create = DSL.using(connection, SQLDialect.POSTGRES);

            Table expenseTable = table(UserController.expensesTableName);
            String query = create.insertInto(expenseTable)
                    .set(field(Expenses.id), uuid)
                    .set(field(Expenses.vendor), expense.getVendor())
                    .set(field(Expenses.date), expense.getDate())
                    .set(field(Expenses.cost), expense.getCost())
                    .getSQL(ParamType.INLINED);
            Statement statement = connection.createStatement();
            statement.execute(query);

            return "200";
        } catch (Exception e) {
            System.out.println("Connection failure.");
            e.printStackTrace();
            return e.getMessage();
        }
    }

    // -------------------------- GET --------------------------

    @GetMapping("/getExpenses")
    public static ArrayList<ExpenseEntity> getExpenses(@RequestParam(value="user") String user) {
        EnvironmentConfig env = new EnvironmentConfig();

        ArrayList<ExpenseEntity> expenses = new ArrayList<>();

        try (Connection connection = DriverManager.getConnection(env.URL, env.props)) {

            System.out.println("Connected to PostgreSQL database!");
            setTableName(user);

            DSLContext create = DSL.using(connection, SQLDialect.POSTGRES);

            Result<Record> result = create.select().from(UserController.expensesTableName).fetch();

            for (Record resultSet : result) {
                ExpenseEntity expense = new ExpenseEntity(
                        (String) resultSet.get(Expenses.id),
                        (String) resultSet.get(Expenses.vendor),
                        (String) resultSet.get(Expenses.date),
                        ((BigDecimal) resultSet.get(Expenses.cost)).doubleValue()
                );
                expenses.add(expense);
            }

        } catch (SQLException e) {
            System.out.println("Connection failure.");
            e.printStackTrace();
        }

        return expenses;
    }


    // ----------------- helpers -----------------
    private static void setTableName(String user) {
        if (UserController.expensesTableName.equals(Expenses.tableName)) {
            UserController.expensesTableName = user + ".expenses";
        }
    }

}
