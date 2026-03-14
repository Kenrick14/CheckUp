package com.test.checkup.Schedulers;


import com.test.checkup.Services.BallDontLieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;




@Component
public class PlayerStatsScheduler {

    @Autowired
    private BallDontLieService ballDontLieService;


    @Scheduled(cron = "0 10 2 * * *")
    public void updatingYesterdaysStats() {
        System.out.println("Checking for new player stats...");

        ballDontLieService.getAndSaveStats();

    }
}
