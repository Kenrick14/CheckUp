package com.test.checkup;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class CheckUpApplication {

    public static void main(String[] args) {
        SpringApplication.run(CheckUpApplication.class, args);
    }

}
