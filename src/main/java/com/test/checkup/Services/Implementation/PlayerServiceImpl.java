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
import java.util.Comparator;

import java.util.List;
import java.util.Optional;
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
        List<PlayerSeasonAveragesDto> all = playerStatsRepository.getAllSeasonAvg();

        String sortField = pageable.getSort().isSorted()
                ? pageable.getSort().iterator().next().getProperty()
                : "avgPoints";
        boolean isDesc = pageable.getSort().isSorted()
                && pageable.getSort().iterator().next().isDescending();

        Comparator<PlayerSeasonAveragesDto> comparator = getComparator(sortField);
        if (isDesc) comparator = comparator.reversed();

        List<PlayerSeasonAveragesDto> sorted = all.stream()
                .sorted(comparator)
                .collect(Collectors.toList());

        int start = (int) pageable.getOffset();
        int end = Math.min(start + pageable.getPageSize(), sorted.size());

        return new PageImpl<>(sorted.subList(start, end), pageable, sorted.size());
    }

    private Comparator<PlayerSeasonAveragesDto> getComparator(String field) {
        return switch (field) {
            case "avgPoints"    -> Comparator.comparingDouble(p -> p.getAvgPoints() != null ? p.getAvgPoints() : 0);
            case "avgAssists"   -> Comparator.comparingDouble(p -> p.getAvgAssists() != null ? p.getAvgAssists() : 0);
            case "avgRebounds"  -> Comparator.comparingDouble(p -> p.getAvgRebounds() != null ? p.getAvgRebounds() : 0);
            case "avgSteals"    -> Comparator.comparingDouble(p -> p.getAvgSteals() != null ? p.getAvgSteals() : 0);
            case "avgBlocks"    -> Comparator.comparingDouble(p -> p.getAvgBlocks() != null ? p.getAvgBlocks() : 0);
            case "avgTurnovers" -> Comparator.comparingDouble(p -> p.getAvgTurnovers() != null ? p.getAvgTurnovers() : 0);
            case "fgPercentage" -> Comparator.comparingDouble(p -> p.getFgPercentage() != null ? p.getFgPercentage() : 0);
            case "tpPercentage" -> Comparator.comparingDouble(p -> p.getTpPercentage() != null ? p.getTpPercentage() : 0);
            case "ftPercentage" -> Comparator.comparingDouble(p -> p.getFtPercentage() != null ? p.getFtPercentage() : 0);
            case "plusMinus"    -> Comparator.comparingDouble(p -> p.getPlusMinus() != null ? p.getPlusMinus() : 0);
            case "lastName"     -> Comparator.comparing(p -> p.getLastName() != null ? p.getLastName() : "");
            case "teamName"     -> Comparator.comparing(p -> p.getTeamName() != null ? p.getTeamName() : "");
            default             -> Comparator.comparingDouble(p -> p.getAvgPoints() != null ? p.getAvgPoints() : 0);
        };
    }


}
