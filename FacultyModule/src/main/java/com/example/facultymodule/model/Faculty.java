package com.example.facultymodule.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

@Data
@Document(collection = "faculty")
public class Faculty {

    @Id
    private String id;

    private String facultyName;

    @Indexed(unique = true)
    private String facultyId;

    @Indexed(unique = true)
    private String emailId;

    private String password;
}