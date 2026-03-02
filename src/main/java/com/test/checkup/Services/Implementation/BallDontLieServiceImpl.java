package com.test.checkup.Services.Implementation;

import com.test.checkup.Config.BallDontLieConfig;
import com.test.checkup.DTO.TeamDto;
import com.test.checkup.Entities.ApiResponse;
import com.test.checkup.Entities.Team;
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

    public List<TeamDto> getAllTeams() {
        String url = ballDontLieConfig.getBaseUrl() + "/teams";

        ResponseEntity<ApiResponse<Team>> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<ApiResponse<Team>>() {}
        );

        return response.getBody().getData()
                .stream()
                .map(teamMapper::mapTo)  // converts each Team → TeamDto
                .collect(Collectors.toList());
    }

}
