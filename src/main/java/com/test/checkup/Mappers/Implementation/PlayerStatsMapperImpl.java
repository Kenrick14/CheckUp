package com.test.checkup.Mappers.Implementation;

import com.test.checkup.DTO.GameDto;
import com.test.checkup.DTO.PlayerStatsDto;
import com.test.checkup.Entities.Game;
import com.test.checkup.Entities.Player;
import com.test.checkup.Entities.PlayerStats;
import com.test.checkup.Mappers.Mapper;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
public class PlayerStatsMapperImpl implements Mapper<PlayerStats, PlayerStatsDto> {

    private ModelMapper modelMapper;

    public PlayerStatsMapperImpl(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
    }

    @Override
    public PlayerStatsDto mapTo(PlayerStats playerStats) {
        PlayerStatsDto playerStatsDto = modelMapper.map(playerStats, PlayerStatsDto.class);
        playerStatsDto.setPlayerId(playerStats.getId());
        playerStatsDto.setPlayerFirstName(playerStats.getPlayer().getFirst_name());
        playerStatsDto.setPlayerLastName(playerStats.getPlayer().getLast_name());

        playerStatsDto.setGameId(playerStats.getGame().getId());
        playerStatsDto.setGameDate(playerStatsDto.getGameDate());
        playerStatsDto.setGameSeason(playerStats.getGame().getSeason());

        return playerStatsDto;
    }

    @Override
    public PlayerStats mapFrom(PlayerStatsDto playerStatsDto) {
        PlayerStats playerStats = modelMapper.map(playerStatsDto, PlayerStats.class);
        Player player = new Player();
        Game game = new Game();

        player.setId(playerStatsDto.getPlayerId());
        player.setFirst_name(playerStatsDto.getPlayerFirstName());
        player.setLast_name(playerStatsDto.getPlayerLastName());

        game.setGameDate(playerStatsDto.getGameDate());
        game.setSeason(playerStatsDto.getGameSeason());

        playerStats.setPlayer(player);
        playerStats.setGame(game);

        return playerStats;
    }
}
