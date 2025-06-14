package com.example.ems.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Salary {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String employeeName;
    private String month;
    private Double amount;
    private String status;
}