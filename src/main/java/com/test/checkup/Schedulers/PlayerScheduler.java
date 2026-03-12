package com.test.checkup.Schedulers;

import com.test.checkup.Config.BallDontLieConfig;
import com.test.checkup.Entities.ApiResponse;
import com.test.checkup.Entities.Player;
import com.test.checkup.Repositories.PlayerRepository;
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
public class PlayerScheduler {
    @Autowired
    private PlayerRepository playerRepository;

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private BallDontLieConfig ballDontLieConfig;

    @Scheduled(cron = "0 0 2 * * *")
    public void updatePlayers(){
        System.out.println("Checking for new/updated players...");

        List<Player> allPlayers = new ArrayList<>();
        Long cursor = null;

        do {
            String url = ballDontLieConfig.getBaseUrl() + "/players/active?per_page=100";
            if (cursor != null) {
                url += "&cursor=" + cursor;
            }

            ResponseEntity<ApiResponse<Player>> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<ApiResponse<Player>>() {}
            );

            ApiResponse<Player> body = response.getBody();
            allPlayers.addAll(body.getData());
            cursor = (body.getMeta() != null) ? body.getMeta().getNext_cursor() : null;

        } while (cursor != null);

        Set<Long> existingPlayerIds = new HashSet<>(playerRepository.findAllPlayerIds());

        List<Player> players = allPlayers
                .stream()
                .filter(player -> !existingPlayerIds.contains(player.getId()))
                .collect(Collectors.toList());

        playerRepository.saveAll(players);
        System.out.println("Saved " + players.size() + " new players");
    }
}
