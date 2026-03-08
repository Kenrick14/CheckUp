package com.test.checkup.Schedulers;

import com.test.checkup.Config.BallDontLieConfig;
import com.test.checkup.Entities.ApiResponse;
import com.test.checkup.Entities.Game;
import com.test.checkup.Mappers.Implementation.GameMapperImpl;
import com.test.checkup.Repositories.GameRepository;
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
public class GameScheduler {
    @Autowired
    private BallDontLieService ballDontLieService;

    @Autowired
    private GameRepository gameRepository;

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private BallDontLieConfig ballDontLieConfig;

    @Autowired
    private GameMapperImpl gameMapper;

    // runs every day at 2 AM
    @Scheduled(cron = "0 0 2 * * *")
    public void fetchYesterdaysGames() {
        String yesterday = LocalDate.now().minusDays(1).toString();
        System.out.println("Fetching games for: " + yesterday);

        String url = ballDontLieConfig.getBaseUrl()
                + "/games?dates[]=" + yesterday + "&per_page=100";

        ResponseEntity<ApiResponse<Game>> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<ApiResponse<Game>>() {}
        );

        List<Game> games = response.getBody().getData()
                .stream()
                .filter(game -> "Final".equals(game.getStatus()))
                .filter(game -> !gameRepository.existsById(game.getId()))
                .collect(Collectors.toList());

        gameRepository.saveAll(games);
        System.out.println("Saved " + games.size() + " new games for " + yesterday);
    }
}
