package com.test.checkup.Mappers.Implementation;

import com.test.checkup.DTO.TeamDto;
import com.test.checkup.Entities.Team;
import com.test.checkup.Mappers.Mapper;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
public class TeamMapperImpl implements Mapper<Team, TeamDto> {

    private ModelMapper modelMapper;

    public TeamMapperImpl(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
    }

    @Override
    public TeamDto mapTo(Team team) {
        return modelMapper.map(team, TeamDto.class);
    }

    @Override
    public Team mapFrom(TeamDto teamDto) {
       return modelMapper.map(teamDto, Team.class);
    }
}
