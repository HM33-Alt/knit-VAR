// backend/src/main/java/com/knit_VAR/controller/DependencyController.java
package com.knit_VAR.controller;

import com.knit_VAR.service.DependencyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class DependencyController {

    @Autowired
    private DependencyService dependencyService;

    @PostMapping("/project")
    public ResponseEntity<String> uploadProject(@RequestParam("file") MultipartFile file) {
        try {
            dependencyService.processProject(file);
            return ResponseEntity.ok("Project uploaded and processed successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to process project: " + e.getMessage());
        }
    }

    @GetMapping("/dependencies")
    public ResponseEntity<Map<String, Object>> getDependencies() {
        Map<String, Object> graph = dependencyService.getDependencyGraph();
        return ResponseEntity.ok(graph);
    }
}