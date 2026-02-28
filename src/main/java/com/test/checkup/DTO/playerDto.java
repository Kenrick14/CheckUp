package com.test.checkup.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class playerDto {
    private long pid;
    private String first_name;
    private String last_name;
    private String position;
    private double height;
    private double weight;
    private long team_id;
}
