package com.example.facultymodule.repository;

import com.example.facultymodule.model.Faculty;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface FacultyRepository extends MongoRepository<Faculty, String> {
    Optional<Faculty> findByEmailId(String emailId);
    Optional<Faculty> findByFacultyId(String facultyId);
    boolean existsByEmailId(String emailId);
    boolean existsByFacultyId(String facultyId);
}