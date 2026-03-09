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
        gameDto.setHomeTeamId(game.getHomeTeam().getId());
        gameDto.setHomeTeamName(game.getHomeTeam().getFullName());
        gameDto.setHomeTeamScore(game.getHomeTeamScore());

        gameDto.setVisitorTeamId(game.getVisitorTeam().getId());
        gameDto.setVisitorTeamName(game.getVisitorTeam().getFullName());
        gameDto.setVisitorTeamScore(game.getVisitorTeamScore());

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
        game.setHomeTeam(homeTeam);
        game.setVisitorTeam(awayTeam);
        game.setHomeTeamScore(gameDto.getHomeTeamScore());
        game.setVisitorTeamScore(gameDto.getVisitorTeamScore());



        return game;
    }
}
