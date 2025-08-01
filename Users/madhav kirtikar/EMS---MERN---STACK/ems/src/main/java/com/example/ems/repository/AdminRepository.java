 package com.example.ems.repository;

import com.example.ems.model.Admin;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminRepository extends JpaRepository<Admin, Long> {
    // Optional custom methods like findByUsername() can be added
}
