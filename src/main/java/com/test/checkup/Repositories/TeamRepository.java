package com.test.checkup.Repositories;

import com.test.checkup.Entities.Team;
import org.springframework.data.repository.CrudRepository;

public interface TeamRepository extends CrudRepository<Team, Long> {
}
