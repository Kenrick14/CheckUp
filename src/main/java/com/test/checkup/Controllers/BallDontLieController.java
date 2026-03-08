package com.test.checkup.Controllers;

import com.test.checkup.DTO.GameDto;
import com.test.checkup.DTO.PlayerDto;
import com.test.checkup.DTO.PlayerStatsDto;
import com.test.checkup.DTO.TeamDto;
import com.test.checkup.Entities.PlayerStats;
import com.test.checkup.Services.BallDontLieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/nba")
public class BallDontLieController {
    @Autowired
    private BallDontLieService ballDontLieService;

    @GetMapping(path = "/teams")
    public ResponseEntity<List<TeamDto>> getAllTeams() {
        List<TeamDto> teams = ballDontLieService.getAllTeams();
        return ResponseEntity.ok(teams);
    }
    @PostMapping(path = "/teams")
    public ResponseEntity<List<TeamDto>> getAndSaveTeams(){
        List<TeamDto> teams = ballDontLieService.getAndSaveTeams();
        return ResponseEntity.status(HttpStatus.CREATED).body(teams);
    }


    @GetMapping(path = "/players")
    public ResponseEntity<List<PlayerDto>> getAllPlayers(){
        List<PlayerDto> players = ballDontLieService.getAllPlayers();
        return ResponseEntity.ok(players);
    }
    @PostMapping(path = "/players")
    public ResponseEntity<List<PlayerDto>> getAndSavePlayers(){
        List<PlayerDto> players = ballDontLieService.getAndSavePlayers();
        return ResponseEntity.status(HttpStatus.CREATED).body(players);
    }


    @GetMapping(path = "/games")
    public ResponseEntity<List<GameDto>> getAllGames(){
        List<GameDto> games = ballDontLieService.getAllGames();
        return ResponseEntity.ok(games);
    }
    @PostMapping(path = "/games")
    public ResponseEntity<List<GameDto>> getAndSaveGames(){
        List<GameDto> games = ballDontLieService.getAndSaveGames();
        return ResponseEntity.status(HttpStatus.CREATED).body(games);
    }

    @GetMapping(path = "/stats")
    public ResponseEntity<List<PlayerStatsDto>> getAllPlayersGameStats(){
        List<PlayerStatsDto> stats = ballDontLieService.getAllStats();
        return ResponseEntity.ok(stats);
    }
    @PostMapping(path = "/stats")
    public ResponseEntity<List<PlayerStatsDto>> getAndSaveStats(){
        List<PlayerStatsDto> stats = ballDontLieService.getAndSaveStats();
        return ResponseEntity.status(HttpStatus.CREATED).body(stats);
    }
}
