package com.test.checkup.Entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
@JsonIgnoreProperties(ignoreUnknown = true) //ignores extra fields
@Table(name = "games",
        indexes = {
                @Index(name = "idx_game_date", columnList = "game_date"),
                @Index(name = "idx_season", columnList = "season")
        })
public class Game {

    @Id
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "home_team_id")
    private Team home_team;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "away_team_id")
    private Team visitor_team;
    private LocalDate date;
    private String season;
    private Integer home_team_score;
    private Integer visitor_team_score;
    private String status;
}
