// backend/src/main/java/com/knit_VAR/service/KnitAnalyzer.java
package com.knit_VAR.service;

import com.knit_VAR.model.KnitAnalysisResult;
import com.knit_VAR.model.Node;
import com.knit_VAR.model.Edge;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * KnitAnalyzer
 *
 * This service provides analysis of a Kotlin file for dependency injection usage
 * and general dependency relationships within a project.
 *
 * It scans the uploaded file content for annotations like @Provides and usage of "by di".
 * Based on the findings, it generates a KnitAnalysisResult containing nodes, edges,
 * dependencies, errors, and suggestions.
 *
 * Portions of this code may have been assisted by GitHub Copilot.
 * All code has been reviewed and manually verified by the author.
 */
@Service
public class KnitAnalyzer {

    /**
     * Analyzes the given Kotlin file for DI usage and dependencies.
     *
     * @param file MultipartFile uploaded by the user
     * @return KnitAnalysisResult containing analysis information
     */
    public KnitAnalysisResult analyzeFull(MultipartFile file) {
        try {
            // Read the full content of the uploaded file
            String content = new BufferedReader(new InputStreamReader(file.getInputStream()))
                    .lines().collect(Collectors.joining("\n"));

            // Initialize lists for the analysis result
            List<Node> nodes = new ArrayList<>();
            List<Edge> edges = new ArrayList<>();
            List<String> dependencies = new ArrayList<>();
            List<String> errors = new ArrayList<>();
            List<String> suggestions = new ArrayList<>();

            // Check if the file contains DI annotations or usage
            boolean hasProvides = content.contains("@Provides");
            boolean hasDi = content.contains("by di");

            // Add nodes and suggestions based on analysis
            if (hasProvides) {
                nodes.add(new Node("provides", "@Provides"));
                suggestions.add("Consider reviewing @Provides usage.");
            }
            if (hasDi) {
                nodes.add(new Node("di", "by di"));
                suggestions.add("Check DI implementation.");
            }
            // Add edges if both @Provides and DI usage exist
            if (hasProvides && hasDi) {
                edges.add(new Edge("provides", "di"));
                dependencies.add("provides -> di");
            }
            // Report error if neither @Provides nor DI found
            if (!hasProvides && !hasDi) {
                errors.add("No @Provides or DI found.");
            }

            // Create result object and set analysis data
            KnitAnalysisResult result = new KnitAnalysisResult();
            result.setHasProvides(hasProvides);
            result.setHasDi(hasDi);
            result.setDependencies(dependencies);
            result.setErrors(errors);
            result.setSuggestions(suggestions);
            result.setNodes(nodes);
            result.setEdges(edges);

            return result;
        } catch (Exception e) {
            // Wrap exceptions for clearer error reporting
            throw new RuntimeException("Failed to analyze file", e);
        }
    }
}
