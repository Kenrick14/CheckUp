package com.test.checkup.Schedulers;

import com.test.checkup.Services.BallDontLieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;


@Component
public class PlayerScheduler {

    @Autowired
    private BallDontLieService ballDontLieService;

    @Scheduled(cron = "0 5 2 * * *")
    public void updatePlayers(){
        System.out.println("Checking for new players...");

        ballDontLieService.getAndSavePlayers();
    }
}
