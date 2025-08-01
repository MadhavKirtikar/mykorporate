 package com.example.ems.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
 import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.example.ems.model.Salary;
import com.example.ems.repository.SalaryRepository;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/salaries")
public class SalaryController {

    private final SalaryRepository repo;

    public SalaryController(SalaryRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Salary> getAll() {
        return repo.findAll();
    }

    @PostMapping
    public Salary add(@Valid @RequestBody Salary salary) {
        return repo.save(salary);
    }

    @PutMapping("/{id}")
    public Salary update(@PathVariable Long id, @Valid @RequestBody Salary salary) {
        if (!repo.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Salary record not found with ID: " + id);
        }
        salary.setId(id);
        return repo.save(salary);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        if (!repo.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Salary record not found with ID: " + id);
        }
        repo.deleteById(id);
    }
}