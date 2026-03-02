package com.test.checkup.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PlayerDto {
    private Long id;
    private String firstName;
    private String lastName;
    private String position;
    private String height;
    private String weight;
    private Long teamId;
    private String teamName;
}
