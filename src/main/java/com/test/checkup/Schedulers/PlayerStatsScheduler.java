package com.test.checkup.Schedulers;

import com.test.checkup.Config.BallDontLieConfig;
import com.test.checkup.Entities.ApiResponse;
import com.test.checkup.Entities.Game;
import com.test.checkup.Entities.PlayerStats;
import com.test.checkup.Mappers.Implementation.PlayerStatsMapperImpl;
import com.test.checkup.Repositories.PlayerStatsRepository;
import com.test.checkup.Services.BallDontLieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class PlayerStatsScheduler {

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private PlayerStatsRepository playerStatsRepository;

    @Autowired
    private BallDontLieConfig ballDontLieConfig;



    //runs every day at 2AM
    @Scheduled(cron = "0 30 2 * * *")
    public void fetchYesterdaysStats(){
        String yesterday = LocalDate.now().minusDays(1).toString();
        System.out.println("Fetching stats for: " + yesterday);

        String url = ballDontLieConfig.getBaseUrl()
                + "/stats?dates[]=" + yesterday + "&per_page=100";

        ResponseEntity<ApiResponse<PlayerStats>> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<ApiResponse<PlayerStats>>() {}
        );

        List<PlayerStats> stats = response.getBody().getData()
                .stream()
                .filter(playerStats -> "Final".equals(playerStats.getGame().getStatus()))
                .filter(playerStats -> !playerStatsRepository.existsById(playerStats.getId()))
                .collect(Collectors.toList());

        playerStatsRepository.saveAll(stats);
        System.out.println("Saved " + stats.size() + " new stats for " + yesterday);
    }
}
