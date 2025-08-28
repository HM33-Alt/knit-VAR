// backend/src/main/java/com/knit_VAR/service/DependencyService.java
package com.knit_VAR.service;

import org.springframework.web.multipart.MultipartFile;
import java.util.Map;

/**
 * Service for processing project files and retrieving dependency graphs.
 */
public interface DependencyService {
    /**
     * Processes the uploaded project file.
     * @param file the project file to process
     */
    void processProject(MultipartFile file);

    /**
     * Retrieves the dependency graph of the processed project.
     * @return a map representing the dependency graph
     */
    Map<String, Object> getDependencyGraph();
}