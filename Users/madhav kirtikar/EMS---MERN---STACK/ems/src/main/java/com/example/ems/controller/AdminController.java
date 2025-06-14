package com.example.ems.controller;

import com.example.ems.model.Admin;
import com.example.ems.repository.AdminRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admins")
public class AdminController {
    private final AdminRepository repo;

    public AdminController(AdminRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Admin> getAll() {
        return repo.findAll();
    }

    @PostMapping
    public Admin add(@RequestBody Admin admin) {
        return repo.save(admin);
    }

    @PutMapping("/{id}")
    public Admin update(@PathVariable Long id, @RequestBody Admin admin) {
        admin.setId(id);
        return repo.save(admin);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repo.deleteById(id);
    }
}