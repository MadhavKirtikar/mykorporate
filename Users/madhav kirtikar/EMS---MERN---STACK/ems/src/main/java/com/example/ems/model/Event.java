package com.example.ems.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Event {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String description;
    private String date;
}