// File: src/main/java/com/example/knit/KnitAnalysisController.java
package com.knit_VAR.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/knit")
public class KnitAnalysisController {

    @PostMapping("/analyze")
    public ResponseEntity<KnitAnalysisResult> analyzeKnitFile(@RequestParam("file") MultipartFile file) {
        // Parse Kotlin file, analyze Knit annotations, build dependency graph
        KnitAnalysisResult result = KnitAnalyzer.analyze(file);
        return ResponseEntity.ok(result);
    }
}