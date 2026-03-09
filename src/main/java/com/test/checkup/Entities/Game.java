package com.test.checkup.Entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
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
                @Index(name = "idx_game_date", columnList = "date"),
                @Index(name = "idx_season", columnList = "season")
        })
public class Game {

    @Id
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "home_team_id")
    @JsonProperty("home_team")
    private Team homeTeam;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "visitor_team_id")
    @JsonProperty("visitor_team")
    private Team visitorTeam;
    private LocalDate date;
    private String season;
    @JsonProperty("home_team_score")
    private Integer homeTeamScore;
    @JsonProperty("visitor_team_score")
    private Integer visitorTeamScore;
    private String status;
}
