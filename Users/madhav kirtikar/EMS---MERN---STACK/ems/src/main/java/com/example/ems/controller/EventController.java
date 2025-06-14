package com.example.ems.controller;

import com.example.ems.model.Event;
import com.example.ems.repository.EventRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/events")
public class EventController {
    private final EventRepository repo;
    public EventController(EventRepository repo) { this.repo = repo; }

    @GetMapping
    public List<Event> getAll() { return repo.findAll(); }

    @PostMapping
    public Event add(@RequestBody Event event) { return repo.save(event); }

    @PutMapping("/{id}")
    public Event update(@PathVariable Long id, @RequestBody Event event) {
        event.setId(id);
        return repo.save(event);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) { repo.deleteById(id); }
}