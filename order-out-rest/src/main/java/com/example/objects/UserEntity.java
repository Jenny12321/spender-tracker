package com.example.objects;

import java.util.UUID;

public class UserEntity {
    private String id;
    private String username;
    private String password;

    public UserEntity(String username, String password) {
        this.id = UUID.randomUUID().toString().replace("-", "");
        this.username = username;
        this.password = password;
    }

    public UserEntity(String id, String username, String password) {
        this.id = id;
        this.username = username;
        this.password = password;
    }

    public String getId() {
        return this.id;
    }

    public String getUsername() {
        return this.username;
    }

    public String getPassword() {
        return this.password;
    }
}
