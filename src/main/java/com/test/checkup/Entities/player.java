package com.test.checkup.Entities;

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
@Table(name = "players")
public class player {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long pid;
    private String first_name;
    private String last_name;
    private String position;
    private double height;
    private double weight;
    private long team_id;
}
