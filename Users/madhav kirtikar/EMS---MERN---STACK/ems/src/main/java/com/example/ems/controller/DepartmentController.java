package com.example.ems.controller;

import com.example.ems.model.Department;
import com.example.ems.repository.DepartmentRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/departments")
public class DepartmentController {
    private final DepartmentRepository repo;
    public DepartmentController(DepartmentRepository repo) { this.repo = repo; }

    @GetMapping
    public List<Department> getAll() { return repo.findAll(); }

    @PostMapping
    public Department add(@RequestBody Department dep) { return repo.save(dep); }

    @PutMapping("/{id}")
    public Department update(@PathVariable Long id, @RequestBody Department dep) {
        dep.setId(id);
        return repo.save(dep);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) { repo.deleteById(id); }
}