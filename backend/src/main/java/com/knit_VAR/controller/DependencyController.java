package com.knit_VAR.controller;

import com.knit_VAR.service.DependencyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class DependencyController {

    @Autowired
    private DependencyService dependencyService;

    @PostMapping("/project")
    public void uploadProject(@RequestParam("file") MultipartFile file) {
        dependencyService.processProject(file);
    }

    @GetMapping("/dependencies")
    public Map<String, Object> getDependencies() {
        return dependencyService.getDependencyGraph();
    }
}