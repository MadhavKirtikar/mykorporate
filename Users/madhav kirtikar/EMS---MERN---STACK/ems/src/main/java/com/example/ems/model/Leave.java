 package com.example.ems.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "leaves")
public class Leave {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String department;
    private String fromDate;
    private String toDate;
    private String reason;

    @Column(nullable = false)
    private String status = "PENDING"; // Default status
}
