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
@Table(name = "teams")
public class team {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long tid;
    private String name;
    private String conference;
    private String Division;
}
