package com.example.facultymodule.controller;

import com.example.facultymodule.model.Faculty;
import com.example.facultymodule.service.FacultyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/faculty")
@CrossOrigin(origins = "*")
public class FacultyController {

    @Autowired
    private FacultyService facultyService;

    // POST /faculty/register
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Faculty faculty) {
        return ResponseEntity.ok(facultyService.register(faculty));
    }

    // POST /faculty/login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        return ResponseEntity.ok(facultyService.login(
                credentials.get("emailId"),
                credentials.get("password")
        ));
    }

    // GET /faculty/validate/{facultyId}  (used by Event Service)
    @GetMapping("/validate/{facultyId}")
    public ResponseEntity<Boolean> validate(@PathVariable String facultyId) {
        return ResponseEntity.ok(facultyService.validateFaculty(facultyId));
    }

    // POST /faculty/events  - Add event
    @PostMapping("/events")
    public ResponseEntity<?> addEvent(@RequestBody Map<String, Object> eventData) {
        System.out.println("Received event: " + eventData);
        return ResponseEntity.ok(facultyService.addEvent(eventData));
    }

    // GET /faculty/events/month?month=6&year=2024
    @GetMapping("/events/month")
    public ResponseEntity<?> getEventsByMonth(
            @RequestParam int month,
            @RequestParam int year) {
        return ResponseEntity.ok(facultyService.getEventsByMonth(month, year));
    }

    // PUT /faculty/events/{eventId}?facultyId=FAC001
    @PutMapping("/events/{eventId}")
    public ResponseEntity<?> updateEvent(
            @PathVariable String eventId,
            @RequestParam String facultyId,
            @RequestBody Map<String, Object> updatedData) {
        return ResponseEntity.ok(facultyService.updateEvent(eventId, facultyId, updatedData));
    }

    // DELETE /faculty/events/{eventId}?facultyId=FAC001
    @DeleteMapping("/events/{eventId}")
    public ResponseEntity<?> deleteEvent(
            @PathVariable String eventId,
            @RequestParam String facultyId) {
        return ResponseEntity.ok(facultyService.deleteEvent(eventId, facultyId));
    }
}