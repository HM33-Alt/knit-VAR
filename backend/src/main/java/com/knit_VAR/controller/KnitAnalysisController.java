package com.knit_VAR.controller;

import com.knit_VAR.model.KnitAnalysisResult;
import com.knit_VAR.service.KnitAnalyzer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/knit")
public class KnitAnalysisController {

    @Autowired
    private KnitAnalyzer knitAnalyzer;

    @PostMapping("/analyze")
    public ResponseEntity<KnitAnalysisResult> analyzeKnitFile(@RequestParam("file") MultipartFile file) {
        KnitAnalysisResult result = knitAnalyzer.analyzeFull(file);
        return ResponseEntity.ok(result);
    }
}