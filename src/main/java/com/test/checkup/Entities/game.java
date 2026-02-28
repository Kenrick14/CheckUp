package com.test.checkup.Entities;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "games")
public class game {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long gid;
    private long home_team_id;
    private long away_team_id;
    private String game_date;
    private String season;
}
