 package com.example.ems.controller;

import com.example.ems.model.Admin;
import com.example.ems.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/admins")
public class AdminController {

    private final AdminRepository repo;

    @Autowired
    public AdminController(AdminRepository repo) {
        this.repo = repo;
    }

    // सभी एडमिन लाओ
    @GetMapping
    public List<Admin> getAll() {
        return repo.findAll();
    }

    // नया एडमिन जोड़ो
    @PostMapping
    public ResponseEntity<Admin> add(@RequestBody Admin admin) {
        Admin saved = repo.save(admin);
        return ResponseEntity.ok(saved);
    }

    // एडमिन अपडेट करो
    @PutMapping("/{id}")
    public ResponseEntity<Admin> update(@PathVariable Long id, @RequestBody Admin admin) {
        Optional<Admin> existing = repo.findById(id);
        if (existing.isPresent()) {
            admin.setId(id);
            Admin updated = repo.save(admin);
            return ResponseEntity.ok(updated);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // एडमिन हटाओ
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        Optional<Admin> existing = repo.findById(id);
        if (existing.isPresent()) {
            repo.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
