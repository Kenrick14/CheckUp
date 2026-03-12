package com.test.checkup.DTO;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PlayerStatsDto {
    private Long id;

    private Long playerId;
    private String playerFirstName;
    private String playerLastName;

    private Long gameId;
    private LocalDate gameDate;
    private Integer gameSeason;

    private Integer pts;
    private Integer ast;
    private Integer reb;
    private Integer stl;
    private Integer blk;
    private Integer turnover;
    private Integer min;

    private Integer fga;
    private Integer fgm;
    private Integer tpa;
    private Integer tpm;
    private Integer fta;
    private Integer ftm;
    private Integer pm;
}
