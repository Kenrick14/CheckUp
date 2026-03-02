package com.test.checkup.Services;

import com.test.checkup.DTO.PlayerDto;
import com.test.checkup.DTO.TeamDto;

import java.util.List;

public interface BallDontLieService {
    List<TeamDto> getAllTeams();

    List<PlayerDto> getAllPlayers();
}
