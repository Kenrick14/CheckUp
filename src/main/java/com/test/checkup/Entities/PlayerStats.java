package com.test.checkup.Entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
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
@JsonIgnoreProperties(ignoreUnknown = true) //ignores extra fields
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
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "player_id")
    private Player player;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "game_id")
    private Game game;
    private Integer pts;
    private Integer ast;
    private Integer reb;
    private Integer stl;
    private Integer blk;
    private Integer turnover;
    private Integer min;
}
