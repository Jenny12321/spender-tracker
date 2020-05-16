package com.example.orderoutrest;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class OrderOutController {

    @GetMapping("/test")
    public static String testGet() {
        return "Hello World!";
    }

}
