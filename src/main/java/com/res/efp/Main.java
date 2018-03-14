package com.res.efp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * Created by gatomulesei on 1/31/2018.
 */
@SpringBootApplication
@EnableScheduling()
public class Main {

    public static void main(String[] args) {
        SpringApplication.run(Main.class, args);
    }
}
