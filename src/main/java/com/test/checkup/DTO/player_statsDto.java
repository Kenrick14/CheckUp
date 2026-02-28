package com.test.checkup.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class player_statsDto {
    private long id;
    private long player_id;
    private long game_id;
    private double points;
    private double assists;
    private double rebounds;
    private double steals;
    private double blocks;
    private double turnovers;
    private double minutes;
}
