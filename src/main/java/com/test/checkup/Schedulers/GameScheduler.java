package com.test.checkup.Schedulers;

import com.test.checkup.Config.BallDontLieConfig;
import com.test.checkup.Entities.ApiResponse;
import com.test.checkup.Entities.Game;
import com.test.checkup.Repositories.GameRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class GameScheduler {
    @Autowired
    private GameRepository gameRepository;

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private BallDontLieConfig ballDontLieConfig;


    @Scheduled(cron = "0 5 2 * * *")
    public void fetchYesterdaysGames() {
        String yesterday = LocalDate.now().minusDays(1).toString();
        System.out.println("Fetching games for: " + yesterday);

        String url = ballDontLieConfig.getBaseUrl()
                + "/games?seasons[]=2025&dates[]=" + yesterday + "&per_page=100";

        ResponseEntity<ApiResponse<Game>> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<ApiResponse<Game>>() {}
        );

        ApiResponse<Game> body = response.getBody();
        assert body != null;

        Set<Long> existingGameIds =new HashSet<>( gameRepository.findAllGameIds());

        List<Game> newGames = body.getData()
                .stream()
                .filter(game -> "Final".equals(game.getStatus()))
                .filter(game -> !existingGameIds.contains(game.getId()))
                .collect(Collectors.toList());

        gameRepository.saveAll(newGames);
        System.out.println("Saved " + newGames.size() + " new games for " + yesterday);
    }
}
