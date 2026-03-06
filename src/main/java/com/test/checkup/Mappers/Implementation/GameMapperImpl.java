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
        GameDto gameDto = new GameDto();

        gameDto.setId(game.getId());
        gameDto.setHomeTeamId(game.getHome_team().getId());
        gameDto.setHomeTeamName(game.getHome_team().getFull_name());
        gameDto.setHomeTeamScore(game.getHome_team_score());

        gameDto.setVisitorTeamId(game.getVisitor_team().getId());
        gameDto.setVisitorTeamName(game.getVisitor_team().getFull_name());
        gameDto.setVisitorTeamScore(game.getVisitor_team_score());

        gameDto.setGameDate(game.getDate());
        gameDto.setSeason(game.getSeason());
        gameDto.setStatus(game.getStatus());

        return gameDto;
    }

    @Override
    public Game mapFrom(GameDto gameDto) {
        Game game = new Game();
        Team homeTeam = new Team();
        Team awayTeam = new Team();

        homeTeam.setId(gameDto.getHomeTeamId());
        homeTeam.setName(gameDto.getHomeTeamName());

        awayTeam.setId(gameDto.getVisitorTeamId());
        awayTeam.setName(gameDto.getVisitorTeamName());

        game.setId(gameDto.getId());
        game.setDate(gameDto.getGameDate());
        game.setSeason(gameDto.getSeason());
        game.setStatus(gameDto.getStatus());
        game.setHome_team_score(gameDto.getHomeTeamScore());
        game.setVisitor_team_score(gameDto.getVisitorTeamScore());
        game.setHome_team(homeTeam);
        game.setVisitor_team(awayTeam);


        return game;
    }
}
