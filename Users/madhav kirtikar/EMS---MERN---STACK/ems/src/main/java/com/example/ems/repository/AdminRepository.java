package com.example.ems.repository;

import com.example.ems.model.Admin;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminRepository extends JpaRepository<Admin, Long> {
    // Optionally add custom queries here
}
