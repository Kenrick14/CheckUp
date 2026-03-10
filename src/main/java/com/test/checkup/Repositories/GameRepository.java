package com.test.checkup.Repositories;

import com.test.checkup.Entities.Game;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface GameRepository extends JpaRepository<Game, Long> {
    @Query("SELECT g.id FROM Game g")
    List<Long> findAllGameIds();
}
