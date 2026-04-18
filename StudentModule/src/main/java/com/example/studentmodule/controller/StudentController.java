package com.example.studentmodule.controller;

import com.example.studentmodule.model.Student;
import com.example.studentmodule.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/students")
@CrossOrigin(origins = "*")
public class StudentController {

    @Autowired
    private StudentService studentService;

    // POST /students/register
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Student student) {
        return ResponseEntity.ok(studentService.register(student));
    }

    // POST /students/login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String emailId = credentials.get("emailId");
        String password = credentials.get("password");
        return ResponseEntity.ok(studentService.login(emailId, password));
    }

    // GET /students/events/{rollNumber}
    @GetMapping("/events/{rollNumber}")
    public ResponseEntity<?> getEvents(@PathVariable String rollNumber) {
        return ResponseEntity.ok(studentService.getEventsByRollNumber(rollNumber));
    }
}