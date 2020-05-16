package com.example.restservices;

import com.example.constants.Heroku;
import com.example.constants.Local;

import java.util.Properties;

public class EnvironmentConfig {

    private static final String ENVIRONMENT = "HEROKU";
    public String URL;
    public Properties props;

    public EnvironmentConfig() {
        props = new Properties();

        switch (ENVIRONMENT) {
            case "HEROKU":
                props.setProperty("user", Heroku.DB_USER);
                props.setProperty("password", Heroku.DB_PASS);
                props.setProperty("ssl","true");
                props.setProperty("sslfactory","org.postgresql.ssl.NonValidatingFactory");
                URL = "jdbc:postgresql://" + Heroku.DB_HOST + ":" + Heroku.DB_PORT + "/" + Heroku.DB;
                break;
            case "LOCAL":
                props.setProperty("user", Local.DB_USER);
                props.setProperty("password", Local.DB_PASS);
                props.setProperty("ssl","false");
                props.setProperty("ssl.enabled","false");
                URL = "jdbc:postgresql://" + Local.DB_HOST + ":" + Local.DB_PORT + "/" + Local.DB;
                break;
            default:
                break;
        }
    }
}
