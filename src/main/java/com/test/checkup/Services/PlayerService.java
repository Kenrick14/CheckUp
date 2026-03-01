package com.test.checkup.Services;

import com.test.checkup.Entities.Player;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface PlayerService {
    Page<Player> findAll(Pageable pageable);
}
