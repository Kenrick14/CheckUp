package com.test.checkup.Services.Implementation;

import com.test.checkup.DTO.PlayerSeasonAveragesDto;
import com.test.checkup.Entities.Player;
import com.test.checkup.Entities.PlayerStats;
import com.test.checkup.Repositories.PlayerRepository;
import com.test.checkup.Repositories.PlayerStatsRepository;
import com.test.checkup.Services.PlayerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.*;

import java.util.stream.Collectors;

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

    @Override
    public Optional<PlayerStats> findMostRecentByPlayerId(Long id) {
        return playerStatsRepository.findMostRecentByPlayerId(id);
    }

    @Override
    public Page<PlayerSeasonAveragesDto> allPlayerSeasonAverages(Pageable pageable) {
        return playerStatsRepository.getAllSeasonAvg(pageable);
    }

    @Override
    public Map<String, List<PlayerSeasonAveragesDto>> getLeaders() {
        List<PlayerSeasonAveragesDto> all = playerStatsRepository.getAllSeasonAvg(Pageable.unpaged()).getContent();

        Map<String, List<PlayerSeasonAveragesDto>> leaders = new LinkedHashMap<>();

        leaders.put("Points", getTop5(all, Comparator.comparingDouble(
                p -> p.getAvgPoints() != null ? p.getAvgPoints() : 0)));
        leaders.put("Assists", getTop5(all, Comparator.comparingDouble(
                p -> p.getAvgAssists() != null ? p.getAvgAssists() : 0)));
        leaders.put("Rebounds", getTop5(all, Comparator.comparingDouble(
                p -> p.getAvgRebounds() != null ? p.getAvgRebounds() : 0)));
        leaders.put("Steals", getTop5(all, Comparator.comparingDouble(
                p -> p.getAvgSteals() != null ? p.getAvgSteals() : 0)));
        leaders.put("Blocks", getTop5(all, Comparator.comparingDouble(
                p -> p.getAvgBlocks() != null ? p.getAvgBlocks() : 0)));
        leaders.put("FG%", getTop5(all, Comparator.comparingDouble(
                p -> p.getFgPercentage() != null ? p.getFgPercentage() : 0)));
        leaders.put("3P%", getTop5(all, Comparator.comparingDouble(
                p -> p.getTpPercentage() != null ? p.getTpPercentage() : 0)));

        return leaders;
    }

    private List<PlayerSeasonAveragesDto> getTop5(
            List<PlayerSeasonAveragesDto> all,
            Comparator<PlayerSeasonAveragesDto> comparator) {
        return all.stream()
                .sorted(comparator.reversed())
                .limit(5)
                .collect(Collectors.toList());
    }


}
