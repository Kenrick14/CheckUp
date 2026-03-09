package com.test.checkup.Controllers;

import com.test.checkup.DTO.PlayerDto;
import com.test.checkup.Entities.Player;
import com.test.checkup.Mappers.Mapper;
import com.test.checkup.Services.PlayerService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

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

    @GetMapping(path = "/players/{name}")
    public ResponseEntity<List<Player>> findPlayer(@PathVariable("name") String name){
        List<Player> players = playerService.findByNameContaining(name);
        return ResponseEntity.ok(players);
    }
}
