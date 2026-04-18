package com.example.eventmodule.controller;

import com.example.eventmodule.model.Event;
import com.example.eventmodule.service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/events")
@CrossOrigin(origins = "*")
public class EventController {

    @Autowired
    private EventService eventService;

    // POST /events  - Add new event
    @PostMapping
    public ResponseEntity<?> addEvent(@RequestBody Event event) {
        return ResponseEntity.ok(eventService.addEvent(event));
    }

    // GET /events/student/{rollNumber}
    @GetMapping("/student/{rollNumber}")
    public ResponseEntity<List<Event>> getByRollNumber(@PathVariable String rollNumber) {
        return ResponseEntity.ok(eventService.getEventsByRollNumber(rollNumber));
    }

    // GET /events/month?month=6&year=2024
    @GetMapping("/month")
    public ResponseEntity<List<Event>> getByMonth(
            @RequestParam int month,
            @RequestParam int year) {
        return ResponseEntity.ok(eventService.getEventsByMonth(month, year));
    }

    // PUT /events/{eventId}?facultyId=FAC001
    @PutMapping("/{eventId}")
    public ResponseEntity<?> updateEvent(
            @PathVariable String eventId,
            @RequestParam String facultyId,
            @RequestBody Event updatedEvent) {
        return ResponseEntity.ok(eventService.updateEvent(eventId, facultyId, updatedEvent));
    }

    // DELETE /events/{eventId}?facultyId=FAC001
    @DeleteMapping("/{eventId}")
    public ResponseEntity<?> deleteEvent(
            @PathVariable String eventId,
            @RequestParam String facultyId) {
        return ResponseEntity.ok(eventService.deleteEvent(eventId, facultyId));
    }

    // GET /events  - Get all events
    @GetMapping
    public ResponseEntity<List<Event>> getAllEvents() {
        return ResponseEntity.ok(eventService.getAllEvents());
    }

    @GetMapping("/filter")
    public ResponseEntity<List<Event>> filterEvents(
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) String rollNumber) {

        return ResponseEntity.ok(eventService.filterEvents(month, year, rollNumber));
    }
}