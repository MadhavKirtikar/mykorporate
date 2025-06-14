package com.example.ems.controller;

import com.example.ems.model.Salary;
import com.example.ems.repository.SalaryRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/salaries")
public class SalaryController {
    private final SalaryRepository repo;
    public SalaryController(SalaryRepository repo) { this.repo = repo; }

    @GetMapping
    public List<Salary> getAll() { return repo.findAll(); }

    @PostMapping
    public Salary add(@RequestBody Salary salary) { return repo.save(salary); }

    @PutMapping("/{id}")
    public Salary update(@PathVariable Long id, @RequestBody Salary salary) {
        salary.setId(id);
        return repo.save(salary);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) { repo.deleteById(id); }
}