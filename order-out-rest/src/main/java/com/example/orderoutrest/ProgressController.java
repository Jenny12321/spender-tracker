package com.example.orderoutrest;

import com.example.objects.ProgressEntity;
import com.example.restservices.EnvironmentConfig;
import com.example.tables.Expenses;
import com.example.tables.Progress;
import org.jooq.*;
import org.jooq.conf.ParamType;
import org.jooq.impl.DSL;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;

import static org.jooq.impl.DSL.*;

@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController
public class ProgressController {

    // -------------------------- POST --------------------------
    @PostMapping("/deleteProgress")
    public static String deleteProgress(@RequestParam(value="user") String user) {
        EnvironmentConfig env = new EnvironmentConfig();

        try (Connection connection = DriverManager.getConnection(env.URL, env.props)) {
            System.out.println("Connected to PostgreSQL database!");

            DSLContext create = DSL.using(connection, SQLDialect.POSTGRES);
            setTableName(user);

            Table progressTable = table(UserController.progressTableName);
            String query = create.truncate(progressTable)
                    .getSQL(ParamType.INLINED);
            Statement statement = connection.createStatement();
            statement.execute(query);

            query = create.deleteFrom(progressTable)
                    .getSQL(ParamType.INLINED);
            statement.execute(query);

            return "200";
        } catch (Exception e) {
            System.out.println("Connection failure.");
            e.printStackTrace();
            return e.getMessage();
        }
    }

    @PostMapping("/setProgress")
    public static String setProgress(@RequestParam(value="user") String user,
                                     @RequestParam(value = "percentOrder") String percentOrder,
                                     @RequestParam(value = "budget") String budget) {
        EnvironmentConfig env = new EnvironmentConfig();

        ProgressEntity progress = new ProgressEntity(Integer.parseInt(percentOrder),
                Integer.parseInt(budget), 0, 0,0);

        try (Connection connection = DriverManager.getConnection(env.URL, env.props)) {
            System.out.println("Connected to PostgreSQL database!");

            DSLContext create = DSL.using(connection, SQLDialect.POSTGRES);
            setTableName(user);

            Table progressTable = table(UserController.progressTableName);

            Result<Record> result = create.select().from(UserController.progressTableName).limit(1).fetch();
            if (result.size() == 0) {
                String query = create.insertInto(progressTable)
                        .set(field(Progress.percentOrder), progress.getPercentOrder())
                        .set(field(Progress.budget), progress.getBudget())
                        .set(field(Progress.spent), progress.getSpent())
                        .set(field(Progress.cookCount), progress.getCookCount())
                        .set(field(Progress.orderCount), progress.getOrderCount())
                        .getSQL(ParamType.INLINED);
                Statement statement = connection.createStatement();
                statement.execute(query);
            } else {
                String query = create.update(progressTable)
                        .set(field(Progress.percentOrder), percentOrder)
                        .set(field(Progress.budget), budget)
                        .getSQL(ParamType.INLINED);
                Statement statement = connection.createStatement();
                statement.execute(query);
            }

            return "200";
        } catch (Exception e) {
            System.out.println("Connection failure.");
            e.printStackTrace();
            return e.getMessage();
        }
    }

    @PostMapping("/addCookCount")
    public static String addCookCount(@RequestParam(value="user") String user,
                                      @RequestParam(value = "count") String count) {
        EnvironmentConfig env = new EnvironmentConfig();

        int addCount = Integer.parseInt(count);

        try (Connection connection = DriverManager.getConnection(env.URL, env.props)) {
            System.out.println("Connected to PostgreSQL database!");

            DSLContext create = DSL.using(connection, SQLDialect.POSTGRES);
            setTableName(user);

            Table progressTable = table(UserController.progressTableName);
            String query = create.update(progressTable)
                    .set(field(Progress.cookCount), field(Progress.cookCount).plus(addCount))
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

    @PostMapping("/addOrderCount")
    public static String addOrderCount(@RequestParam(value="user") String user,
                                       @RequestParam(value = "count") String count) {
        EnvironmentConfig env = new EnvironmentConfig();

        int addCount = Integer.parseInt(count);

        try (Connection connection = DriverManager.getConnection(env.URL, env.props)) {
            System.out.println("Connected to PostgreSQL database!");

            DSLContext create = DSL.using(connection, SQLDialect.POSTGRES);
            setTableName(user);

            Table progressTable = table(UserController.progressTableName);
            String query = create.update(progressTable)
                    .set(field(Progress.orderCount), field(Progress.orderCount).plus(addCount))
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

    @PostMapping("/changePercentOrder")
    public static String changePercentOrder(@RequestParam(value="user") String user,
                                            @RequestParam(value = "percent") String percent) {
        EnvironmentConfig env = new EnvironmentConfig();

        int changePercent = Integer.parseInt(percent);

        try (Connection connection = DriverManager.getConnection(env.URL, env.props)) {
            System.out.println("Connected to PostgreSQL database!");

            DSLContext create = DSL.using(connection, SQLDialect.POSTGRES);
            setTableName(user);

            Table progressTable = table(UserController.progressTableName);
            String query = create.update(progressTable)
                    .set(field(Progress.percentOrder), changePercent)
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

    @PostMapping("/changeBudget")
    public static String changeBudget(@RequestParam(value="user") String user,
                                      @RequestParam(value = "budget") String budget) {
        EnvironmentConfig env = new EnvironmentConfig();

        double changeBudget = Double.parseDouble(budget);

        try (Connection connection = DriverManager.getConnection(env.URL, env.props)) {
            System.out.println("Connected to PostgreSQL database!");

            DSLContext create = DSL.using(connection, SQLDialect.POSTGRES);

            setTableName(user);

            Table progressTable = table(UserController.progressTableName);
            String query = create.update(progressTable)
                    .set(field(Progress.budget), changeBudget)
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
    @GetMapping("/progress")
    public static ProgressEntity getProgress(@RequestParam(value="user") String user) {
        EnvironmentConfig env = new EnvironmentConfig();

        try (Connection connection = DriverManager.getConnection(env.URL, env.props)) {

            System.out.println("Connected to PostgreSQL database!");

            DSLContext create = DSL.using(connection, SQLDialect.POSTGRES);
            setTableName(user);
            ExpensesController.setTableName(user);
            System.out.println(UserController.progressTableName);

            Table progressTable = table(UserController.progressTableName);
            Table expensesTable = table(UserController.expensesTableName);

            Result<Record1<BigDecimal>> sumResult = create.select(sum(field(Expenses.cost, Integer.class)))
                    .from(UserController.expensesTableName).fetch();
            BigDecimal sum = (BigDecimal) sumResult.get(0).get("sum");

            String query = create.update(progressTable)
                    .set(field(Progress.spent), sum)
                    .getSQL(ParamType.INLINED);
            Statement statement = connection.createStatement();
            statement.execute(query);

            Result<Record> result = create.select().from(UserController.progressTableName).limit(1).fetch();

            ProgressEntity progress = new ProgressEntity(
                    (Integer) result.get(0).get(Progress.percentOrder),
                    ((BigDecimal) result.get(0).get(Progress.budget)).doubleValue(),
                    ((BigDecimal) result.get(0).get(Progress.spent)).doubleValue(),
                    (Integer) result.get(0).get(Progress.cookCount),
                    (Integer) result.get(0).get(Progress.orderCount)
            );

            return progress;

        } catch (SQLException e) {
            System.out.println("Connection failure.");
            e.printStackTrace();
        } catch (IndexOutOfBoundsException e) {
            return new ProgressEntity(0, 0, 0, 0,0);
        }

        return null;
    }

    // ----------------- helpers -----------------
    private static void setTableName(String user) {
        if (UserController.progressTableName.equals(Progress.tableName)) {
            UserController.progressTableName = user + ".progress";
        }
    }

}
