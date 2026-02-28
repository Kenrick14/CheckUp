package com.test.checkup.Repositories;

import com.test.checkup.Entities.player_stats;
import org.springframework.data.repository.CrudRepository;

public interface playerStatsRepository extends CrudRepository<player_stats, Long> {
}
