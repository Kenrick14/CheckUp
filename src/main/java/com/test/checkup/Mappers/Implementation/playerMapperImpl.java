package com.test.checkup.Mappers.Implementation;

import com.test.checkup.Entities.Team;
import org.modelmapper.ModelMapper;
import com.test.checkup.DTO.PlayerDto;
import com.test.checkup.Entities.Player;
import com.test.checkup.Mappers.Mapper;
import org.springframework.stereotype.Component;

@Component
public class playerMapperImpl implements Mapper<Player, PlayerDto> {

    private ModelMapper modelMapper;

    public playerMapperImpl(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
    }

    @Override
    public PlayerDto mapTo(Player player) {
        PlayerDto playerDto = modelMapper.map(player, PlayerDto.class);
        if(player.getTeam() != null){
            playerDto.setTeamId(player.getTeam().getId());
            playerDto.setTeamName(player.getTeam().getName());
        }
        return playerDto;
    }

    @Override
    public Player mapFrom(PlayerDto playerDto) {
        Player player =  modelMapper.map(playerDto, Player.class);
        if(player.getTeam() != null){
            Team team = new Team();
            team.setId(playerDto.getTeamId());
            team.setName(playerDto.getTeamName());
            player.setTeam(team);
        }

        return player;
    }
}
