 package com.example.ems.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Attendance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long employeeId; // या @ManyToOne से relation बनाओ अगर चाहिए
    private String date;
    private String status; // Present, Absent, Half-day, Leave etc.
}
