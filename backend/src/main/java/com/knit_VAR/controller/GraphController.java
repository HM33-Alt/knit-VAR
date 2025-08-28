package com.knit_VAR.controller;

import com.knit_VAR.model.GraphResponse;
import com.knit_VAR.service.GraphService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/graph")
public class GraphController {

    @Autowired
    private GraphService graphService;

    @PostMapping("/analyze")
    public ResponseEntity<GraphResponse> analyzeProject(@RequestParam("projectPath") String projectPath) {
        GraphResponse graphResponse = graphService.analyzeProject(projectPath);
        return ResponseEntity.ok(graphResponse);
    }

    @PostMapping("/issues")
    public ResponseEntity<Object> detectIssues(@RequestBody GraphResponse graph) {
        return ResponseEntity.ok(graphService.detectIssues(graph));
    }

    @PostMapping("/suggestions")
    public ResponseEntity<Object> generateSuggestions(@RequestBody GraphResponse graph) {
        return ResponseEntity.ok(graphService.generateSuggestions(graph));
    }
}