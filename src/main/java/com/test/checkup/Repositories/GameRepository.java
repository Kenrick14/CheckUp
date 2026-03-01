package com.test.checkup.Repositories;

import com.test.checkup.Entities.Game;
import org.springframework.data.repository.CrudRepository;

public interface GameRepository extends CrudRepository<Game, Long> {
}
