package com.example.studentmodule.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

@Data
@Document(collection = "students")
public class Student {

    @Id
    private String id;

    private String studentName;

    @Indexed(unique = true)
    private String rollNumber;

    @Indexed(unique = true)
    private String emailId;

    private String password;
}