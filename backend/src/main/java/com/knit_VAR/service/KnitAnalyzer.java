package com.knit_VAR.service;

import com.knit_VAR.model.KnitAnalysisResult;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.stream.Collectors;

@Service
public class KnitAnalyzer {

    public KnitAnalysisResult analyze(MultipartFile file) {
        try {
            // Read file content
            String content = new BufferedReader(new InputStreamReader(file.getInputStream()))
                    .lines().collect(Collectors.joining("\n"));

            // Parse content (basic example, replace with a proper Kotlin parser)
            boolean hasProvides = content.contains("@Provides");
            boolean hasDi = content.contains("by di");

            // Analyze dependencies (simplified example)
            KnitAnalysisResult result = new KnitAnalysisResult();
            result.setHasProvides(hasProvides);
            result.setHasDi(hasDi);
            result.setErrors(hasProvides && hasDi ? null : "Missing @Provides or by di");

            return result;
        } catch (Exception e) {
            throw new RuntimeException("Failed to analyze file", e);
        }
    }
}