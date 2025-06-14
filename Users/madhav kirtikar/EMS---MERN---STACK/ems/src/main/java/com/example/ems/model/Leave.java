package com.example.ems.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Leave {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String department;
    private String fromDate;
    private String toDate;
    private String reason;
    private String status;
}