package com.test.checkup.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TeamDto {
    private Long id;
    private String name;
    private String full_name;
    private String abbreviation;
    private String conference;
    private String division;
}
