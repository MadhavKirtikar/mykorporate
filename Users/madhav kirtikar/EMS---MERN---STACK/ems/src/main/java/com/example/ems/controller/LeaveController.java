package com.example.ems.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.ems.model.Leave;
import com.example.ems.repository.LeaveRepository;

@RestController
@RequestMapping("/api/leaves")
public class LeaveController {
    private final LeaveRepository repo;
    public LeaveController(LeaveRepository repo) { this.repo = repo; }

    @GetMapping
    public List<Leave> getAll() { return repo.findAll(); }

    @PostMapping
    public Leave add(@RequestBody Leave leave) {
        leave.setStatus("Pending");
        return repo.save(leave);
    }

    @PatchMapping("/{id}")
    public Leave updateStatus(@PathVariable Long id, @RequestBody Leave leave) {
        Leave l = repo.findById(id).orElseThrow();
        l.setStatus(leave.getStatus());
        return repo.save(l);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) { repo.deleteById(id); }
}