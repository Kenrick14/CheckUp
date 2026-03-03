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
import com.test.checkup.Services.BallDontLieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

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
        String url = ballDontLieConfig.getBaseUrl() + "/players?per_page=100";

        ResponseEntity<ApiResponse<Player>> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<ApiResponse<Player>>() {}
        );

        return response.getBody().getData()
                .stream()
                .map(playerMapper::mapTo)
                .collect(Collectors.toList());
    }

    @Override
    public List<GameDto> getAllGames() {
        String url = ballDontLieConfig.getBaseUrl() +  "/games?seasons[]=2025&per_page=100";

        ResponseEntity<ApiResponse<Game>> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<ApiResponse<Game>>() {}
        );

        return response.getBody().getData()
                .stream()
                .map(gameMapper::mapTo)
                .collect(Collectors.toList());
    }

    @Override
    public List<PlayerStatsDto> getAllStats() {
        String url = ballDontLieConfig.getBaseUrl() + "/stats?seasons[]=2025&per_page=100";

        ResponseEntity<ApiResponse<PlayerStats>> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<ApiResponse<PlayerStats>>() {}
        );

        return response.getBody().getData()
                .stream()
                .map(playerStatsMapper::mapTo)
                .collect(Collectors.toList());
    }

}
