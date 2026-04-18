package com.example.studentmodule.repository;

import com.example.studentmodule.model.Student;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface StudentRepository extends MongoRepository<Student, String> {
    Optional<Student> findByEmailId(String emailId);
    Optional<Student> findByRollNumber(String rollNumber);
    boolean existsByEmailId(String emailId);
    boolean existsByRollNumber(String rollNumber);
}