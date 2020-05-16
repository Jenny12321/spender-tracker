package com.example.objects;

public class UserAuth {
    private UserEntity userEntity;
    private String message;
    private boolean success;

    public UserAuth(UserEntity userEntity, String message, boolean success) {
        this.userEntity = userEntity;
        this.message = message;
        this.success = success;
    }

    public UserEntity getUserEntity() {
        return this.userEntity;
    }

    public String getMessage() {
        return this.message;
    }

    public boolean getSuccess() {
        return this.success;
    }
}
