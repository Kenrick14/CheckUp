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
            "ROUND(AVG(ps.pts),2), " +
            "ROUND(AVG(ps.ast),2), " +
            "ROUND(AVG(ps.reb),2), " +
            "ROUND(AVG(ps.stl),2), " +
            "ROUND(AVG(ps.blk),2), " +
            "ROUND(AVG(ps.turnover),2), " +
            "ROUND(AVG(ps.min),2)) " +
            "FROM PlayerStats ps " +
            "WHERE ps.player.id = :id " +
            "GROUP BY ps.player.id, ps.player.firstName, ps.player.lastName, ps.player.position, ps.player.team.name")
    Optional<PlayerSeasonAveragesDto> getSeasonAvg(@Param("id") Long id);
}
