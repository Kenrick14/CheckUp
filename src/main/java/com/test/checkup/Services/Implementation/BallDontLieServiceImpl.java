package com.test.checkup.Services.Implementation;

import com.test.checkup.Config.BallDontLieConfig;
import com.test.checkup.DTO.GameDto;
import com.test.checkup.DTO.PlayerDto;
import com.test.checkup.DTO.PlayerStatsDto;
import com.test.checkup.DTO.TeamDto;
import com.test.checkup.Entities.*;
import com.test.checkup.Mappers.Implementation.GameMapperImpl;
import com.test.checkup.Mappers.Implementation.PlayerMapperImpl;
import com.test.checkup.Mappers.Implementation.PlayerStatsMapperImpl;
import com.test.checkup.Mappers.Implementation.TeamMapperImpl;
import com.test.checkup.Repositories.GameRepository;
import com.test.checkup.Repositories.PlayerRepository;
import com.test.checkup.Repositories.PlayerStatsRepository;
import com.test.checkup.Repositories.TeamRepository;
import com.test.checkup.Services.BallDontLieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BallDontLieServiceImpl implements BallDontLieService {
    @Autowired
    private BallDontLieConfig ballDontLieConfig;
    @Autowired
    private RestTemplate restTemplate;
    @Autowired
    private TeamMapperImpl teamMapper;
    @Autowired
    private PlayerMapperImpl playerMapper;
    @Autowired
    private GameMapperImpl gameMapper;
    @Autowired
    private PlayerStatsMapperImpl playerStatsMapper;
    @Autowired
    private TeamRepository teamRepository;
    @Autowired
    private PlayerRepository playerRepository;
    @Autowired
    private GameRepository gameRepository;
    @Autowired
    private PlayerStatsRepository playerStatsRepository;

    public List<TeamDto> getAllTeams() {
        String url = ballDontLieConfig.getBaseUrl() + "/teams";

        ResponseEntity<ApiResponse<Team>> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<ApiResponse<Team>>() {}
        );
        List<String> nbaDivisions = List.of(
                "Atlantic", "Central", "Southeast",
                "Northwest", "Pacific", "Southwest"
        );
        return response.getBody().getData()
                .stream()
                .filter(team -> nbaDivisions.contains(team.getDivision())) //filter out just nba teams
                .map(teamMapper::mapTo)  // converts each Team → TeamDto
                .collect(Collectors.toList());
    }

    @Override
    public List<PlayerDto> getAllPlayers() {
        List<Player> allPlayers = new ArrayList<>();
        Long cursor = null;

        do {
            String url = ballDontLieConfig.getBaseUrl() + "/players/active?per_page=100&";
            if (cursor != null) {
                url += "&cursor=" + cursor;
            }

            ResponseEntity<ApiResponse<Player>> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<ApiResponse<Player>>() {
                    }
            );

            ApiResponse<Player> body = response.getBody();
            allPlayers.addAll(body.getData());
            cursor = (body.getMeta() != null) ? body.getMeta().getNext_cursor() : null;

        }while(cursor != null);


        return allPlayers.stream()
                .map(playerMapper::mapTo)
                .collect(Collectors.toList());
    }

    @Override
    public List<GameDto> getAllGames() {
        List<Game> allGames = new ArrayList<>();
        Long cursor = null;

        do{
            String url = ballDontLieConfig.getBaseUrl() + "/games?seasons[]=2025&per_page=100";
            if(cursor != null){
                url += "&cursor=" + cursor;
            }

            ResponseEntity<ApiResponse<Game>> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<ApiResponse<Game>>() {}
            );

            ApiResponse<Game> body = response.getBody();
            body.getData()
                    .stream()
                    .filter(game -> "Final".equals(game.getStatus()))
                    .forEach(allGames::add);

            cursor = (body.getMeta() != null) ? body.getMeta().getNext_cursor() : null;

        }while(cursor != null);

        return allGames.stream()
                .map(gameMapper::mapTo)
                .collect(Collectors.toList());
    }

    @Override
    public List<PlayerStatsDto> getAllStats() {
        List<PlayerStats> allStats = new ArrayList<>();
        Long cursor = null;
        int requestCount = 0;

        do {
            // pause every 55 requests to stay under the request limit
            if (requestCount > 0 && requestCount % 55 == 0) {
                try {
                    System.out.println("Approaching request limit, pausing for 60 seconds...");
                    Thread.sleep(60000);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
            }

            String url = ballDontLieConfig.getBaseUrl() + "/stats?seasons[]=2025&per_page=100";
            if(cursor != null){
                url += "&cursor=" + cursor;
            }

            ResponseEntity<ApiResponse<PlayerStats>> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<ApiResponse<PlayerStats>>() {
                    }
            );
            ApiResponse<PlayerStats> body = response.getBody();
            body.getData()
                    .stream()
                    .filter(playerStats -> "Final".equals(playerStats.getGame().getStatus()))
                    .forEach(allStats::add);

            cursor = (body.getMeta() != null) ? body.getMeta().getNext_cursor() : null;
            requestCount++;

        }while(cursor != null);

        return allStats
                .stream()
                .map(playerStatsMapper::mapTo)
                .collect(Collectors.toList());
    }

    //Adding Data to Database
    @Override
    public List<TeamDto> getAndSaveTeams() {
        List<TeamDto> teams = getAllTeams();

        teams.stream()
                .map(teamMapper::mapFrom)
                .forEach(teamRepository::save);
        return teams;
    }

    @Override
    public List<PlayerDto> getAndSavePlayers() {
        List<PlayerDto> players = getAllPlayers();

        List<Player> playerEntities = players.stream()
                .map(playerMapper::mapFrom)
                .filter(player -> !playerRepository.existsById(player.getId()))
                .collect(Collectors.toList());
        playerRepository.saveAll(playerEntities);
        return players;
    }

    @Override
    public List<GameDto> getAndSaveGames() {
        List<GameDto> games = getAllGames();

        List<Game> gameEntities = games.stream()
                .map(gameMapper::mapFrom)
                .filter(game -> !gameRepository.existsById(game.getId()))
                .collect(Collectors.toList());
        gameRepository.saveAll(gameEntities);
        return games;
    }

    @Override
    public List<PlayerStatsDto> getAndSaveStats() {
        List<PlayerStatsDto> stats = getAllStats();

        List<PlayerStats> statsEntities = stats.stream()
                .map(playerStatsMapper::mapFrom)
                .filter(playerStats -> !playerStatsRepository.existsById((playerStats.getId())))
                .collect(Collectors.toList());
        playerStatsRepository.saveAll(statsEntities);
        return stats;
    }

}
