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
    private Long pid;
    private String firstName;
    private String lastName;
    private String position;
    private double height;
    private double weight;
    private Long teamId;
    private String teamName;
}
