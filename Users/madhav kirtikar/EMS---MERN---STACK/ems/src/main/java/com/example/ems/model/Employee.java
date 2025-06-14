package com.example.ems.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Employee {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String department;
    private String position;
    private String email;
    private String phone;
    private String address;
    private String salary;
    private String password;
    private String photo;
    private String gender;
    private Integer age;
    private Double performance;
}