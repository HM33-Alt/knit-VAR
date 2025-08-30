package com.knit_VAR.service;

import org.springframework.web.multipart.MultipartFile;
import com.knit_VAR.dto.DependencyAnalysisResult;

/**
 * DependencyService
 *
 * Interface defining the contract for processing Kotlin projects and retrieving dependency graphs.
 *
 * Methods:
 * - processProject: Accepts a Kotlin file upload and processes it to extract dependency information.
 * - getDependencyGraph: Returns the analyzed dependency data, including nodes, edges, errors, and suggestions.
 *
 * Portions of this file may have been assisted by GitHub Copilot.
 * All code has been reviewed and manually verified by the author.
 */
public interface DependencyService {

    /**
     * Process a Kotlin project file to extract dependencies.
     * @param file the uploaded Kotlin file (.kt)
     */
    void processProject(MultipartFile file);

    /**
     * Get the dependency analysis result of the last processed project.
     * @return a DependencyAnalysisResult containing nodes, edges, errors, and suggestions
     */
    DependencyAnalysisResult getDependencyGraph();
}
