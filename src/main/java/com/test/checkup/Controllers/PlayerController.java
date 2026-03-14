package com.test.checkup.Controllers;

import com.test.checkup.DTO.PlayerDto;
import com.test.checkup.DTO.PlayerSeasonAveragesDto;
import com.test.checkup.Entities.Player;
import com.test.checkup.Entities.PlayerStats;
import com.test.checkup.Mappers.Mapper;
import com.test.checkup.Services.PlayerService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/CheckUp/v1")
public class PlayerController {
    private PlayerService playerService;
    private Mapper<Player, PlayerDto> playerMapper;

    public PlayerController(PlayerService playerService, Mapper<Player, PlayerDto> playerMapper) {
        this.playerService = playerService;
        this.playerMapper = playerMapper;
    }

    @GetMapping(path = "/players")
    public Page<PlayerDto> listOfPlayers(Pageable pageable){
        Page<Player> players = playerService.findAll(pageable);
        return players.map(playerMapper::mapTo);
    }

    @GetMapping(path = "/players/search")
    public ResponseEntity<List<Player>> findPlayer(@RequestParam String name){
        List<Player> players = playerService.findByNameContaining(name);
        return ResponseEntity.ok(players);
    }

    @GetMapping(path = "/players/stats/{id}")
    public ResponseEntity<PlayerSeasonAveragesDto> getSeasonAvg(@PathVariable("id") Long id){
        return playerService.playerSeasonAverages(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping(path = "/players/stats/recent/{id}")
    public ResponseEntity<PlayerStats> getRecentGameStats(@PathVariable Long id) {
        return playerService.findMostRecentByPlayerId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping(path = "/players/stats")
    public ResponseEntity<Page<PlayerSeasonAveragesDto>> getAllSeasonAverages(Pageable pageable) {
        Page<PlayerSeasonAveragesDto> allSeasonAverages = playerService.allPlayerSeasonAverages(pageable);
        return ResponseEntity.ok(allSeasonAverages);
    }
}
