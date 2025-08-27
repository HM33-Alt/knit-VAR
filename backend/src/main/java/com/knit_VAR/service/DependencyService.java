package com.knit_VAR.service;

import org.springframework.web.multipart.MultipartFile;
import java.util.Map;

public interface DependencyService {
    void processProject(MultipartFile file);
    Map<String, Object> getDependencyGraph();
}