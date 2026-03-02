package com.test.checkup.Mappers.Implementation;

import com.test.checkup.DTO.GameDto;
import com.test.checkup.Entities.Game;
import com.test.checkup.Entities.Team;
import com.test.checkup.Mappers.Mapper;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
public class GameMapperImpl implements Mapper<Game, GameDto> {

    private ModelMapper modelMapper;

    public GameMapperImpl(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
    }

    @Override
    public GameDto mapTo(Game game) {
        GameDto gameDto = modelMapper.map(game, GameDto.class);
        gameDto.setHomeTeamId(game.getHomeTeam().getId());
        gameDto.setHomeTeamName(game.getHomeTeam().getName());

        gameDto.setAwayTeamId(game.getAwayteam().getId());
        gameDto.setAwayTeamName(game.getAwayteam().getName());
        return gameDto;
    }

    @Override
    public Game mapFrom(GameDto gameDto) {
        Game game = modelMapper.map(gameDto, Game.class);
        Team homeTeam = new Team();
        Team awayTeam = new Team();

        homeTeam.setId(gameDto.getHomeTeamId());
        homeTeam.setName(gameDto.getHomeTeamName());

        awayTeam.setId(gameDto.getAwayTeamId());
        awayTeam.setName(gameDto.getAwayTeamName());

        game.setHomeTeam(homeTeam);
        game.setAwayteam(awayTeam);

        return game;
    }
}
