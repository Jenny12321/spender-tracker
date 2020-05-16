package com.example.orderoutrest;

import com.example.objects.UserAuth;
import com.example.objects.UserEntity;
import com.example.restservices.EnvironmentConfig;
import com.example.tables.Expenses;
import com.example.tables.Progress;
import com.example.tables.Users;
import org.jooq.*;
import org.jooq.conf.ParamType;
import org.jooq.impl.DSL;
import org.jooq.impl.SQLDataType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import static org.jooq.impl.DSL.*;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;

@RestController
public class UserController {
    static String expensesTableName = Expenses.tableName;
    static String progressTableName = Progress.tableName;
    private UserEntity user;

    // -------------------------- POST --------------------------

    @PostMapping("/createAccount")
    public UserAuth createAccount(@RequestParam(value = "username") String username,
                                  @RequestParam(value = "password") String password) {

        EnvironmentConfig env = new EnvironmentConfig();
        user = new UserEntity(username.toLowerCase(), password);
        expensesTableName = user.getUsername() + "." + Expenses.tableName;
        progressTableName = user.getUsername() + "." + Progress.tableName;

        try (Connection connection = DriverManager.getConnection(env.URL, env.props)) {
            System.out.println("Connected to PostgreSQL database!");

            DSLContext create = DSL.using(connection, SQLDialect.POSTGRES);
            Statement statement = connection.createStatement();

            Table usersTable = table(Users.tableName);

            Result existingUser = create.select()
                    .from(Users.tableName)
                    .where(field(Users.username).eq(user.getUsername()))
                    .getQuery()
                    .fetch();

            if (!existingUser.isEmpty()) {
                return new UserAuth(null, "User already exists", false);
            }

            // Create schema for user
            CreateSchemaFinalStep schemaQ = create.createSchema(user.getUsername());
            schemaQ.execute();

            // Insert user into user table
            String query = create.insertInto(usersTable)
                    .set(field(Users.id), user.getId())
                    .set(field(Users.username), user.getUsername())
                    .set(field(Users.password), user.getPassword())
                    .getSQL(ParamType.INLINED);
            statement.execute(query);

            // Create expenses table
            Table expensesTable = table(expensesTableName);
            String createTableQ = create.createTable(expensesTable)
                    .column(Expenses.id, SQLDataType.VARCHAR(255))
                    .column(Expenses.vendor, SQLDataType.VARCHAR(255))
                    .column(Expenses.date, SQLDataType.VARCHAR(32))
                    .column(Expenses.cost, SQLDataType.DECIMAL(2))
                    .getSQL(ParamType.INLINED);
            statement.execute(createTableQ);

            // Create progress table
            Table progressTable = table(progressTableName);
            createTableQ = create.createTable(progressTable)
                    .column(Progress.percentOrder, SQLDataType.INTEGER)
                    .column(Progress.budget, SQLDataType.DECIMAL(2))
                    .column(Progress.cookCount, SQLDataType.INTEGER)
                    .column(Progress.orderCount, SQLDataType.INTEGER)
                    .getSQL(ParamType.INLINED);
            statement.execute(createTableQ);

            return new UserAuth(user, "200", true);
        } catch (Exception e) {
            System.out.println("Connection failure.");
            e.printStackTrace();
            return new UserAuth(null, e.getMessage(), false);
        }
    }

    // -------------------------- GET --------------------------
    @GetMapping("/login")
    public UserAuth login(@RequestParam(value = "username") String username,
                          @RequestParam(value = "password") String password) {
        EnvironmentConfig env = new EnvironmentConfig();
        this.user = new UserEntity(username.toLowerCase(), password);
        expensesTableName = user.getUsername() + ".expenses";
        progressTableName = user.getUsername() + ".progress";

        try (Connection connection = DriverManager.getConnection(env.URL, env.props)) {
            System.out.println("Connected to PostgreSQL database!");

            DSLContext create = DSL.using(connection, SQLDialect.POSTGRES);

            Result existingUser = create.select()
                    .from(Users.tableName)
                    .where(field(Users.username).eq(username.toLowerCase()))
                    .getQuery()
                    .fetch();

            if (existingUser.isEmpty()) {
                return new UserAuth(null, "User not found", false);
            } else if (!existingUser.getValues("password").get(0).toString().equals(password)) {
                return new UserAuth(null, "Incorrect password", false);
            }
            return new UserAuth(user, "200", true);
        } catch (Exception e) {
            System.out.println("Connection failure.");
            e.printStackTrace();
            return new UserAuth(null, e.getMessage(), false);
        }
    }
}
