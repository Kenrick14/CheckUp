package com.test.checkup.Schedulers;

import com.test.checkup.Config.BallDontLieConfig;
import com.test.checkup.Entities.ApiResponse;
import com.test.checkup.Entities.Game;
import com.test.checkup.Entities.Player;
import com.test.checkup.Entities.PlayerStats;
import com.test.checkup.Repositories.GameRepository;
import com.test.checkup.Repositories.PlayerRepository;
import com.test.checkup.Repositories.PlayerStatsRepository;
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
public class PlayerStatsScheduler {

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private PlayerStatsRepository playerStatsRepository;

    @Autowired
    private PlayerRepository playerRepository;

    @Autowired
    private GameRepository gameRepository;

    @Autowired
    private BallDontLieConfig ballDontLieConfig;


    @Scheduled(cron = "0 10 2 * * *")
    public void fetchYesterdaysStats() {
        String yesterday = LocalDate.now().minusDays(1).toString();
        System.out.println("Fetching stats for: " + yesterday);

        List<PlayerStats> allPlayerStats = new ArrayList<>();
        Long cursor = null;

        do {
            String url = ballDontLieConfig.getBaseUrl()
                    + "/stats?seasons[]=2025&dates[]=" + yesterday + "&per_page=100";
            if (cursor != null) {
                url += "&cursor=" + cursor;
            }

            ResponseEntity<ApiResponse<PlayerStats>> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<ApiResponse<PlayerStats>>() {}
            );

            ApiResponse<PlayerStats> body = response.getBody();
            assert body != null;
            allPlayerStats.addAll(body.getData());
            cursor = (body.getMeta() != null) ? body.getMeta().getNext_cursor() : null;

        } while (cursor != null);

        Set<Long> playerIds = new HashSet<>(playerRepository.findAllPlayerIds());
        Set<Long> gameIds = new HashSet<>(gameRepository.findAllGameIds());
        Set<Long> existingStatsIds = new HashSet<>(playerStatsRepository.findAllStatsIds());

        List<PlayerStats> stats = allPlayerStats
                .stream()
                .filter(playerStats -> "Final".equals(playerStats.getGame().getStatus()))
                .filter(stat -> playerIds.contains(stat.getPlayer().getId()))
                .filter(stat -> gameIds.contains(stat.getGame().getId()))
                .filter(playerStats -> !existingStatsIds.contains(playerStats.getId()))
                .collect(Collectors.toList());

        playerStatsRepository.saveAll(stats);
        System.out.println("Saved " + stats.size() + " new stats for " + yesterday);
    }
}
