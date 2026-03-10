package com.test.checkup.Repositories;

import com.test.checkup.Entities.PlayerStats;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface PlayerStatsRepository extends JpaRepository<PlayerStats, Long> {

    @Query("SELECT ps.id FROM PlayerStats ps")
    List<Long> findAllStatsIds();
}
