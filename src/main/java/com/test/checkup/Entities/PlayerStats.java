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
@Table(name = "player_stats",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"player_id", "game_id"})
        },
        indexes = {
            @Index(name = "idx_player_stats_player", columnList = "player_id"),
            @Index(name = "idx_player_stats_game", columnList = "game_id")
    })
public class PlayerStats {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "player_id")
    private Player player;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "game_id")
    private Game game;
    private Integer points;
    private Integer assists;
    private Integer rebounds;
    private Integer steals;
    private Integer blocks;
    private Integer turnovers;
    private Integer minutes;
}
