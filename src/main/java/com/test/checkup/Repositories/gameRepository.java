package com.test.checkup.Repositories;

import com.test.checkup.Entities.game;
import org.springframework.data.repository.CrudRepository;

public interface gameRepository extends CrudRepository<game, Long> {
}
