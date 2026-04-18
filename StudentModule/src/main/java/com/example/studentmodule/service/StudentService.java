package com.example.studentmodule.service;

import com.example.studentmodule.model.Student;
import com.example.studentmodule.repository.StudentRepository;
import com.example.studentmodule.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private RestTemplate restTemplate;

    @Value("${event.service.url}")
    private String eventServiceUrl;

    public Map<String, String> register(Student student) {
        if (studentRepository.existsByEmailId(student.getEmailId())) {
            return Map.of("status", "error", "message", "Email already registered");
        }
        if (studentRepository.existsByRollNumber(student.getRollNumber())) {
            return Map.of("status", "error", "message", "Roll number already registered");
        }
        studentRepository.save(student);

        String token = jwtUtil.generateToken(student.getEmailId(), student.getRollNumber());

        return Map.of(
                "status", "success",
                "message", "Student registered successfully",
                "token", token
        );
    }

    public Map<String, String> login(String emailId, String password) {
        Optional<Student> studentOpt = studentRepository.findByEmailId(emailId);
        if (studentOpt.isEmpty()) {
            return Map.of("status", "error", "message", "Student not found");
        }
        Student student = studentOpt.get();
        if (!student.getPassword().equals(password)) {
            return Map.of("status", "error", "message", "Invalid password");
        }
        String token = jwtUtil.generateToken(student.getEmailId(), student.getRollNumber());
        return Map.of(
                "status", "success",
                "message", "Login successful",
                "rollNumber", student.getRollNumber(),
                "studentName", student.getStudentName(),
                "token", token
        );
    }

    public Object getEventsByRollNumber(String rollNumber) {
        // Verify student exists
        Optional<Student> studentOpt = studentRepository.findByRollNumber(rollNumber);
        if (studentOpt.isEmpty()) {
            return Map.of("status", "error", "message", "Student not found");
        }
        // Call Event Microservice
        String url = eventServiceUrl + "/events/student/" + rollNumber;
        try {
            List events = restTemplate.getForObject(url, List.class);
            return events;
        } catch (Exception e) {
            return Map.of("status", "error", "message", "Could not fetch events: " + e.getMessage());
        }
    }
}