package com.test.checkup.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class GameDto {
    private Long id;
    private Long homeTeamId;
    private String homeTeamName;
    private Long visitorTeamId;
    private String visitorTeamName;
    private LocalDate gameDate;
    private Integer season;
    private Integer homeTeamScore;
    private Integer visitorTeamScore;
    private String status;
}
