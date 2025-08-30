package com.knit_VAR.service;

import org.springframework.web.multipart.MultipartFile;
import com.knit_VAR.dto.DependencyAnalysisResult;

public interface DependencyService {
    void processProject(MultipartFile file);
    DependencyAnalysisResult getDependencyGraph();
}