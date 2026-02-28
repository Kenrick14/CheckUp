package com.test.checkup.Repositories;

import com.test.checkup.Entities.player;
import org.springframework.data.repository.CrudRepository;

public interface playerRepository extends CrudRepository<player, Long> {
}
