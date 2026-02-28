package com.test.checkup.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class gameDto {
    private long gid;
    private long home_team_id;
    private long away_team_id;
    private String game_date;
    private String season;
}
