package com.test.checkup.Repositories;

import com.test.checkup.Entities.Player;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;

public interface PlayerRepository extends CrudRepository<Player, Long>,
        PagingAndSortingRepository<Player, Long> {
}
