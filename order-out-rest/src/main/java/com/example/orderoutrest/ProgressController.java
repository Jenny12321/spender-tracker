package com.example.orderoutrest;

import com.example.objects.ProgressEntity;
import com.example.restservices.EnvironmentConfig;
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

import static org.jooq.impl.DSL.field;
import static org.jooq.impl.DSL.table;

@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController
public class ProgressController {

    // -------------------------- POST --------------------------

    @PostMapping("/setProgress")
    public static String setProgress(@RequestParam(value = "percentOrder") String percentOrder,
                                     @RequestParam(value = "budget") String budget) {
        EnvironmentConfig env = new EnvironmentConfig();

        ProgressEntity progress = new ProgressEntity(Integer.parseInt(percentOrder),
                Integer.parseInt(budget), 0, 0,0);

        try (Connection connection = DriverManager.getConnection(env.URL, env.props)) {
            System.out.println("Connected to PostgreSQL database!");

            DSLContext create = DSL.using(connection, SQLDialect.POSTGRES);

            Table progressTable = table(UserController.progressTableName);
            String query = create.insertInto(progressTable)
                    .set(field(Progress.percentOrder), progress.getPercentOrder())
                    .set(field(Progress.budget), progress.getBudget())
                    .set(field(Progress.spent), progress.getSpent())
                    .set(field(Progress.cookCount), progress.getCookCount())
                    .set(field(Progress.orderCount), progress.getOrderCount())
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

    @PostMapping("/addCookCount")
    public static String addCookCount(@RequestParam(value = "count") String count) {
        EnvironmentConfig env = new EnvironmentConfig();

        int addCount = Integer.parseInt(count);

        try (Connection connection = DriverManager.getConnection(env.URL, env.props)) {
            System.out.println("Connected to PostgreSQL database!");

            DSLContext create = DSL.using(connection, SQLDialect.POSTGRES);

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
    public static String addOrderCount(@RequestParam(value = "count") String count) {
        EnvironmentConfig env = new EnvironmentConfig();

        int addCount = Integer.parseInt(count);

        try (Connection connection = DriverManager.getConnection(env.URL, env.props)) {
            System.out.println("Connected to PostgreSQL database!");

            DSLContext create = DSL.using(connection, SQLDialect.POSTGRES);

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
    public static String changePercentOrder(@RequestParam(value = "percent") String percent) {
        EnvironmentConfig env = new EnvironmentConfig();

        int changePercent = Integer.parseInt(percent);

        try (Connection connection = DriverManager.getConnection(env.URL, env.props)) {
            System.out.println("Connected to PostgreSQL database!");

            DSLContext create = DSL.using(connection, SQLDialect.POSTGRES);

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
    public static String changeBudget(@RequestParam(value = "budget") String budget) {
        EnvironmentConfig env = new EnvironmentConfig();

        double changeBudget = Double.parseDouble(budget);

        try (Connection connection = DriverManager.getConnection(env.URL, env.props)) {
            System.out.println("Connected to PostgreSQL database!");

            DSLContext create = DSL.using(connection, SQLDialect.POSTGRES);

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
    public static ProgressEntity getProgress() {
        EnvironmentConfig env = new EnvironmentConfig();

        try (Connection connection = DriverManager.getConnection(env.URL, env.props)) {

            System.out.println("Connected to PostgreSQL database!");

            DSLContext create = DSL.using(connection, SQLDialect.POSTGRES);

            Result<Record> result = create.select().from(UserController.expensesTableName).limit(1).fetch();

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
        }

        return null;
    }

}
