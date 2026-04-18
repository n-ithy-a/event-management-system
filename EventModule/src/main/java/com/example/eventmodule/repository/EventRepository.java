package com.example.eventmodule.repository;

import com.example.eventmodule.model.Event;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.time.LocalDate;
import java.util.List;

public interface EventRepository extends MongoRepository<Event, String> {

    List<Event> findByStudentRollNumber(String studentRollNumber);

    List<Event> findByFacultyId(String facultyId);

    // Find events where eventDate is between start and end of month
    List<Event> findByEventDateBetween(LocalDate startDate, LocalDate endDate);

    List<Event> findByStudentRollNumberAndFacultyId(String studentRollNumber, String facultyId);
}