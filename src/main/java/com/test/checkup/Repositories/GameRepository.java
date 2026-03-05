package com.test.checkup.Repositories;

import com.test.checkup.Entities.Game;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;

public interface GameRepository extends JpaRepository<Game, Long> {
}
