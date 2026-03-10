package com.test.checkup.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PlayerSeasonAveragesDto {
    private Long playerId;
    private String firstName;
    private String lastName;
    private String position;
    private String teamName;

    private Double avgPoints;
    private Double avgAssists;
    private Double avgRebounds;
    private Double avgSteals;
    private Double avgBlocks;
    private Double avgTurnovers;
    private Double avgMinutes;
}
