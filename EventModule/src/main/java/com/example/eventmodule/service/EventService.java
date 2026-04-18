package com.example.eventmodule.service;

import com.example.eventmodule.model.Event;
import com.example.eventmodule.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private RestTemplate restTemplate;

    @Value("${faculty.service.url}")
    private String facultyServiceUrl;

    // Validate faculty via Faculty Microservice
    private boolean isFacultyValid(String facultyId) {
        try {
            String url = facultyServiceUrl + "/faculty/validate/" + facultyId;
            Boolean valid = restTemplate.getForObject(url, Boolean.class);
            return Boolean.TRUE.equals(valid);
        } catch (Exception e) {
            return false;
        }
    }

    public Object addEvent(Event event) {
        if (!isFacultyValid(event.getFacultyId())) {
            return Map.of("status", "error", "message", "Invalid Faculty ID");
        }
        Event saved = eventRepository.save(event);
        return saved;
    }

    public List<Event> getEventsByRollNumber(String rollNumber) {
        return eventRepository.findByStudentRollNumber(rollNumber);
    }

    public List<Event> getEventsByMonth(int month, int year) {
        return eventRepository.findAll().stream()
                .filter(e -> {
                    if (e.getEventDate() == null) return false;
                    return e.getEventDate().getMonthValue() == month &&
                            e.getEventDate().getYear() == year;
                })
                .toList();
    }

    public Object updateEvent(String eventId, String facultyId, Event updatedEvent) {
        Optional<Event> eventOpt = eventRepository.findById(eventId);
        if (eventOpt.isEmpty()) {
            return Map.of("status", "error", "message", "Event not found");
        }
        Event existingEvent = eventOpt.get();

        // Access control: only owner faculty can update
        if (!existingEvent.getFacultyId().equals(facultyId)) {
            return Map.of("status", "error", "message", "Access denied: You can only update your own event records");
        }

        // Update fields
        if (updatedEvent.getStudentName() != null)
            existingEvent.setStudentName(updatedEvent.getStudentName());
        if (updatedEvent.getStudentRollNumber() != null)
            existingEvent.setStudentRollNumber(updatedEvent.getStudentRollNumber());
        if (updatedEvent.getEventName() != null)
            existingEvent.setEventName(updatedEvent.getEventName());
        if (updatedEvent.getEventLocation() != null)
            existingEvent.setEventLocation(updatedEvent.getEventLocation());
        if (updatedEvent.getEventDate() != null)
            existingEvent.setEventDate(updatedEvent.getEventDate());
        if (updatedEvent.getEventDescription() != null)
            existingEvent.setEventDescription(updatedEvent.getEventDescription());

        Event saved = eventRepository.save(existingEvent);
        return saved;
    }

    public Object deleteEvent(String eventId, String facultyId) {
        Optional<Event> eventOpt = eventRepository.findById(eventId);
        if (eventOpt.isEmpty()) {
            return Map.of("status", "error", "message", "Event not found");
        }
        Event existingEvent = eventOpt.get();

        // Access control: only owner faculty can delete
        if (!existingEvent.getFacultyId().equals(facultyId)) {
            return Map.of("status", "error", "message", "Access denied: You can only delete your own event records");
        }

        eventRepository.deleteById(eventId);
        return Map.of("status", "success", "message", "Event deleted successfully");
    }

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public List<Event> filterEvents(Integer month, Integer year, String rollNumber) {
        return eventRepository.findAll().stream()
                .filter(e -> {
                    if (e.getEventDate() == null) return false;

                    boolean match = true;

                    if (month != null && year != null) {
                        match = match &&
                                e.getEventDate().getMonthValue() == month &&
                                e.getEventDate().getYear() == year;
                    }

                    if (rollNumber != null && !rollNumber.isEmpty()) {
                        match = match &&
                                e.getStudentRollNumber().equalsIgnoreCase(rollNumber);
                    }

                    return match;
                })
                .toList();
    }
}