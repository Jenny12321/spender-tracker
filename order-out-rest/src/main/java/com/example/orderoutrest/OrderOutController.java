package com.example.orderoutrest;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController
public class OrderOutController {

    @GetMapping("/test")
    public static String testGet() {
        return "Hello World!";
    }

}
