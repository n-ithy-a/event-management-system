package com.example.facultymodule.service;

import com.example.facultymodule.model.Faculty;
import com.example.facultymodule.repository.FacultyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class FacultyService {

    @Autowired
    private FacultyRepository facultyRepository;

    @Autowired
    private RestTemplate restTemplate;

    @Value("${event.service.url}")
    private String eventServiceUrl;

    public Map<String, String> register(Faculty faculty) {
        if (facultyRepository.existsByEmailId(faculty.getEmailId())) {
            return Map.of("status", "error", "message", "Email already registered");
        }
        if (facultyRepository.existsByFacultyId(faculty.getFacultyId())) {
            return Map.of("status", "error", "message", "Faculty ID already exists");
        }
        facultyRepository.save(faculty);
        return Map.of("status", "success", "message", "Faculty registered successfully");
    }

    public Map<String, String> login(String emailId, String password) {
        Optional<Faculty> facultyOpt = facultyRepository.findByEmailId(emailId);
        if (facultyOpt.isEmpty()) {
            return Map.of("status", "error", "message", "Faculty not found");
        }
        Faculty faculty = facultyOpt.get();
        if (!faculty.getPassword().equals(password)) {
            return Map.of("status", "error", "message", "Invalid password");
        }
        return Map.of(
                "status", "success",
                "message", "Login successful",
                "facultyId", faculty.getFacultyId(),
                "facultyName", faculty.getFacultyName()
        );
    }

    // Validate faculty exists (used internally / by Event Service)
    public boolean validateFaculty(String facultyId) {
        return facultyRepository.findByFacultyId(facultyId).isPresent();
    }

    // Add event - delegates to Event Service
    public Object addEvent(Map<String, Object> eventData) {
        String facultyId = (String) eventData.get("facultyId");
        if (!validateFaculty(facultyId)) {
            System.out.println("Saving event: " + eventData);
            return Map.of("status", "error", "message", "Invalid Faculty ID");
        }
        String url = eventServiceUrl + "/events";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(eventData, headers);
        try {
            ResponseEntity<Object> response = restTemplate.postForEntity(url, request, Object.class);
            return response.getBody();
        } catch (Exception e) {
            return Map.of("status", "error", "message", "Event service error: " + e.getMessage());
        }
    }

    // View events by month
    public Object getEventsByMonth(int month, int year) {
        String url = eventServiceUrl + "/events/month?month=" + month + "&year=" + year;
        try {
            ResponseEntity<List> response = restTemplate.getForEntity(url, List.class);
            return response.getBody();
        } catch (Exception e) {
            return Map.of("status", "error", "message", "Event service error: " + e.getMessage());
        }
    }

    // Update event with faculty access control
    public Object updateEvent(String eventId, String facultyId, Map<String, Object> updatedData) {
        if (!validateFaculty(facultyId)) {
            return Map.of("status", "error", "message", "Invalid Faculty ID");
        }
        updatedData.put("facultyId", facultyId);
        String url = eventServiceUrl + "/events/" + eventId + "?facultyId=" + facultyId;
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(updatedData, headers);
        try {
            ResponseEntity<Object> response = restTemplate.exchange(url, HttpMethod.PUT, request, Object.class);
            return response.getBody();
        } catch (Exception e) {
            return Map.of("status", "error", "message", "Event service error: " + e.getMessage());
        }
    }

    // Delete event with faculty access control
    public Object deleteEvent(String eventId, String facultyId) {
        if (!validateFaculty(facultyId)) {
            return Map.of("status", "error", "message", "Invalid Faculty ID");
        }
        String url = eventServiceUrl + "/events/" + eventId + "?facultyId=" + facultyId;
        try {
            ResponseEntity<Object> response = restTemplate.exchange(url, HttpMethod.DELETE, null, Object.class);
            return response.getBody();
        } catch (Exception e) {
            return Map.of("status", "error", "message", "Event service error: " + e.getMessage());
        }
    }
}