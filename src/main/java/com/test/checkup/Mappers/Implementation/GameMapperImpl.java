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
        gameDto.setHomeTeamId(game.getHome_team().getId());
        gameDto.setHomeTeamName(game.getHome_team().getFull_name());

        gameDto.setVisitorTeamId(game.getVisitor_team().getId());
        gameDto.setVisitorTeamName(game.getVisitor_team().getFull_name());
        return gameDto;
    }

    @Override
    public Game mapFrom(GameDto gameDto) {
        Game game = modelMapper.map(gameDto, Game.class);
        Team homeTeam = new Team();
        Team awayTeam = new Team();

        homeTeam.setId(gameDto.getHomeTeamId());
        homeTeam.setName(gameDto.getHomeTeamName());

        awayTeam.setId(gameDto.getVisitorTeamId());
        awayTeam.setName(gameDto.getVisitorTeamName());

        game.setHome_team(homeTeam);
        game.setVisitor_team(awayTeam);

        return game;
    }
}
