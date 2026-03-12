package com.test.checkup.Services;

import com.test.checkup.DTO.PlayerSeasonAveragesDto;
import com.test.checkup.Entities.Player;
import com.test.checkup.Entities.PlayerStats;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface PlayerService {
    Page<Player> findAll(Pageable pageable);


    List<Player> findByNameContaining(String name);

    Optional<PlayerSeasonAveragesDto> playerSeasonAverages(Long id);

    Optional<PlayerStats> findMostRecentByPlayerId(Long id);
}
