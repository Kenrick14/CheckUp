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
        PlayerStatsDto playerStatsDto = new PlayerStatsDto();

        playerStatsDto.setId(playerStats.getId());

        playerStatsDto.setPlayerId(playerStats.getId());
        playerStatsDto.setPlayerFirstName(playerStats.getPlayer().getFirstName());
        playerStatsDto.setPlayerLastName(playerStats.getPlayer().getLastName());

        playerStatsDto.setGameId(playerStats.getGame().getId());
        playerStatsDto.setGameDate(playerStats.getGame().getDate());
        playerStatsDto.setGameSeason(playerStats.getGame().getSeason());

        playerStatsDto.setPts(playerStats.getPts());
        playerStatsDto.setAst(playerStats.getAst());
        playerStatsDto.setReb(playerStats.getReb());
        playerStatsDto.setStl(playerStats.getStl());
        playerStatsDto.setBlk(playerStats.getBlk());
        playerStatsDto.setTurnover(playerStats.getTurnover());
        playerStatsDto.setMin(playerStats.getMin());

        return playerStatsDto;
    }

    @Override
    public PlayerStats mapFrom(PlayerStatsDto playerStatsDto) {
        PlayerStats playerStats = new PlayerStats();
        Player player = new Player();
        Game game = new Game();


        player.setId(playerStatsDto.getPlayerId());
        player.setFirstName(playerStatsDto.getPlayerFirstName());
        player.setLastName(playerStatsDto.getPlayerLastName());

        game.setId(playerStatsDto.getId());
        game.setDate(playerStatsDto.getGameDate());
        game.setSeason(playerStatsDto.getGameSeason());

        playerStats.setId(playerStatsDto.getId());
        playerStats.setPts(playerStatsDto.getPts());
        playerStats.setAst(playerStatsDto.getAst());
        playerStats.setReb(playerStatsDto.getReb());
        playerStats.setStl(playerStatsDto.getStl());
        playerStats.setBlk(playerStatsDto.getBlk());
        playerStats.setTurnover(playerStatsDto.getTurnover());
        playerStats.setMin(playerStatsDto.getMin());
        playerStats.setPlayer(player);
        playerStats.setGame(game);

        return playerStats;
    }
}
