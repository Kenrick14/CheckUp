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
@Table(name = "teams",
        indexes = {
                @Index(name = "idx_team_name", columnList = "name"),
                @Index(name = "idx_team_abv", columnList = "abbreviation")
        })
public class Team {
    @Id
    private Long id;
    private String name;
    private String full_name;
    private String abbreviation;
    private String conference;
    private String division;
}
