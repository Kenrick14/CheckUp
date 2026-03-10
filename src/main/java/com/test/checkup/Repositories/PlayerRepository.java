package com.test.checkup.Repositories;

import com.test.checkup.Entities.Player;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.List;
import java.util.Optional;

public interface PlayerRepository extends JpaRepository<Player, Long>,
        PagingAndSortingRepository<Player, Long> {

    @Query("SELECT p FROM Player p WHERE LOWER(p.firstName) LIKE LOWER(CONCAT('%', :name, '%')) OR LOWER(p.lastName) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<Player> findByNameContaining(String name);

    @Query("SELECT p.id FROM Player p")
    List<Long> findAllPlayerIds();
}
