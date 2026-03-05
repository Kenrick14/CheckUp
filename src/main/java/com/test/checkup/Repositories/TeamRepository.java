package com.test.checkup.Repositories;

import com.test.checkup.Entities.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;

public interface TeamRepository extends JpaRepository<Team, Long> {
}
