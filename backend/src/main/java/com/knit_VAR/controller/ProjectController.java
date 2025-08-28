// backend/src/main/java/com/knit_VAR/controller/ProjectController.java
package com.knit_VAR.controller;

import com.knit_VAR.service.DependencyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/api/project")
public class ProjectController {

    @Autowired
    private DependencyService dependencyService;

    @PostMapping("/upload")
    public ResponseEntity<String> uploadProject(@RequestParam("file") MultipartFile file) {
        try {
            dependencyService.processProject(file);
            return ResponseEntity.ok("Project uploaded and processed successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to process project: " + e.getMessage());
        }
    }

    @GetMapping("/dependencies")
    public ResponseEntity<Object> getDependencies() {
        try {
            return ResponseEntity.ok(dependencyService.getDependencyGraph());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to retrieve dependencies: " + e.getMessage());
        }
    }
}