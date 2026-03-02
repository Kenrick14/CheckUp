package com.test.checkup.Controllers;

import com.test.checkup.DTO.TeamDto;
import com.test.checkup.Services.BallDontLieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/nba")
public class BallDontLieController {
    @Autowired
    private BallDontLieService ballDontLieService;

    @GetMapping("/teams")
    public ResponseEntity<List<TeamDto>> getAllTeams() {
        List<TeamDto> teams = ballDontLieService.getAllTeams();
        return ResponseEntity.ok(teams);
    }
}
