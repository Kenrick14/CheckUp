package com.test.checkup.Repositories;

import com.test.checkup.Entities.PlayerStats;
import org.springframework.data.repository.CrudRepository;

public interface PlayerStatsRepository extends CrudRepository<PlayerStats, Long> {
}
