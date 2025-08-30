package com.knit_VAR.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.knit_VAR.service.DependencyService;
import com.knit_VAR.dto.DependencyAnalysisResult;
import org.springframework.beans.factory.annotation.Autowired;

@RestController
@RequestMapping("/api")
public class DependencyController {

    @Autowired
    private DependencyService dependencyService;

    @PostMapping("/upload")
    public void uploadProject(@RequestParam("file") MultipartFile file) {
        dependencyService.processProject(file);
    }

    @GetMapping("/dependencies")
    public DependencyAnalysisResult getDependencies() {
        return dependencyService.getDependencyGraph();
    }
}