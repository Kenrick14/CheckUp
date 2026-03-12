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

        playerStatsDto.setPlayerId(playerStats.getPlayer().getId());
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

        playerStatsDto.setFga(playerStats.getFga());
        playerStatsDto.setFgm(playerStats.getFgm());
        playerStatsDto.setTpa(playerStats.getTpa());
        playerStatsDto.setTpm(playerStats.getTpm());
        playerStatsDto.setFta(playerStats.getFta());
        playerStatsDto.setFtm(playerStats.getFtm());
        playerStatsDto.setPm(playerStats.getPm());

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

        game.setId(playerStatsDto.getGameId());
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

        playerStats.setFga(playerStatsDto.getFga());
        playerStats.setFgm(playerStatsDto.getFgm());
        playerStats.setTpa(playerStatsDto.getTpa());
        playerStats.setTpm(playerStatsDto.getTpm());
        playerStats.setFta(playerStatsDto.getFta());
        playerStats.setFtm(playerStatsDto.getFtm());
        playerStats.setPm(playerStatsDto.getPm());

        playerStats.setPlayer(player);
        playerStats.setGame(game);

        return playerStats;
    }
}
