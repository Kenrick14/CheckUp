package com.test.checkup.Services.Implementation;

import com.test.checkup.DTO.PlayerSeasonAveragesDto;
import com.test.checkup.Entities.Player;
import com.test.checkup.Repositories.PlayerRepository;
import com.test.checkup.Repositories.PlayerStatsRepository;
import com.test.checkup.Services.PlayerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PlayerServiceImpl implements PlayerService {

    private PlayerRepository playerRepository;
    @Autowired
    private PlayerStatsRepository playerStatsRepository;

    public PlayerServiceImpl(PlayerRepository playerRepository) {
        this.playerRepository = playerRepository;
    }

    @Override
    public Page<Player> findAll(Pageable pageable) {
        return playerRepository.findAll(pageable);
    }

    @Override
    public List<Player> findByNameContaining(String name) {
        return playerRepository.findByNameContaining(name);
    }

    @Override
    public Optional<PlayerSeasonAveragesDto> playerSeasonAverages(Long id) {
        return playerStatsRepository.getSeasonAvg(id);
    }


}
