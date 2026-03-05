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
@Table(name = "players",
        indexes = {
                @Index(name = "idx_player_name", columnList = "firstName, lastName")
        })
public class Player {
    @Id
    private Long id;
    private String first_name;
    private String last_name;
    private String position;
    private String height;
    private String weight;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id")
    private Team team;
}
