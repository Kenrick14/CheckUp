package com.test.checkup.Repositories;

import com.test.checkup.DTO.PlayerSeasonAveragesDto;
import com.test.checkup.Entities.PlayerStats;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PlayerStatsRepository extends JpaRepository<PlayerStats, Long> {

    @Query("SELECT ps.id FROM PlayerStats ps")
    List<Long> findAllStatsIds();

    @Query("SELECT new com.test.checkup.DTO.PlayerSeasonAveragesDto(" +
            "ps.player.id, " +
            "ps.player.firstName, " +
            "ps.player.lastName, " +
            "ps.player.position, " +
            "ps.player.team.name, " +
            "ROUND(AVG(ps.pts),1), " +
            "ROUND(AVG(ps.ast),1), " +
            "ROUND(AVG(ps.reb),1), " +
            "ROUND(AVG(ps.stl),1), " +
            "ROUND(AVG(ps.blk),1), " +
            "ROUND(AVG(ps.turnover),1), " +
            "ROUND(AVG(ps.min),1), " +
            "ROUND((SUM(ps.fgm) * 1.0 / NULLIF(SUM(ps.fga), 0) * 100), 1), " +
            "ROUND((SUM(ps.tpm) * 1.0 / NULLIF(SUM(ps.tpa), 0) * 100), 1), " +
            "ROUND((SUM(ps.ftm) * 1.0 / NULLIF(SUM(ps.fta), 0) * 100), 1), " +
            "SUM(ps.pm)) " +
            "FROM PlayerStats ps " +
            "WHERE ps.player.id = :id " +
            "AND ps.min > 0 " +
            "GROUP BY ps.player.id, ps.player.firstName, ps.player.lastName, ps.player.position, ps.player.team.name")
    Optional<PlayerSeasonAveragesDto> getSeasonAvg(@Param("id") Long id);
}
