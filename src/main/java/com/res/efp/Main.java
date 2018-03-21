package com.res.efp;

import com.res.efp.service.impl.StorageService;
import com.res.efp.utils.ScheduledTasks;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

import javax.annotation.Resource;

/**
 * Created by gatomulesei on 1/31/2018.
 */
@SpringBootApplication
@EnableScheduling()
public class Main implements CommandLineRunner {

    @Resource
    StorageService storageService;

    @Autowired
    ScheduledTasks scheduledTasks;

    public static void main(String[] args) {
        SpringApplication.run(Main.class, args);
    }

    @Override
    public void run(String... arg) throws Exception {
        storageService.init();
        scheduledTasks.deleteOldReservations();
    }
}
