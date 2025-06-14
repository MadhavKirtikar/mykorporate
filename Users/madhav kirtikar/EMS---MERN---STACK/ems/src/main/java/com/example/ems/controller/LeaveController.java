package com.example.ems.controller;

import com.example.ems.model.Leave;
import com.example.ems.repository.LeaveRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

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