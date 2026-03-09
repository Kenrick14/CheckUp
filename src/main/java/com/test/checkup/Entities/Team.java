package com.test.checkup.Entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
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
@Table(name = "teams",
        indexes = {
                @Index(name = "idx_team_name", columnList = "name"),
                @Index(name = "idx_team_abv", columnList = "abbreviation")
        })
public class Team {
    @Id
    private Long id;
    private String name;
    @JsonProperty("full_name")
    private String fullName;
    private String abbreviation;
    private String conference;
    private String division;
}
