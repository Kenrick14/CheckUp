package com.test.checkup.Entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "player_stats")
public class player_stats {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
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
