package com.knit_VAR.controller;

import com.knit_VAR.service.DependencyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/project")
public class ProjectController {

    @Autowired
    private DependencyService dependencyService;

    @PostMapping("/upload")
    public ResponseEntity<String> uploadProject(@RequestParam("file") MultipartFile file) {
        dependencyService.processProject(file);
        return ResponseEntity.ok("Project uploaded and processed successfully");
    }

    @GetMapping("/dependencies")
    public ResponseEntity<Object> getDependencies() {
        return ResponseEntity.ok(dependencyService.getDependencyGraph());
    }
}