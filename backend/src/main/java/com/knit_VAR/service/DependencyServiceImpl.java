package com.knit_VAR.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.*;
import java.nio.file.*;
import java.util.*;
import java.util.zip.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.knit_VAR.dto.DependencyAnalysisResult;

/**
 * DependencyServiceImpl
 *
 * Implementation of DependencyService for analyzing Kotlin project dependencies.
 *
 * - Accept a zipped Kotlin project (.zip) and extract its contents
 * - Scan Kotlin source files for @Provides annotated classes and DI references
 * - Build nodes and edges for the dependency graph
 * - Detect simple circular dependencies and unused dependencies
 * - Placeholder methods for version conflict detection and visualization enhancements
 *
 * Portions of this code may have been assisted by GitHub Copilot.
 * All code has been reviewed and manually verified by the author.
 */
@Service
public class DependencyServiceImpl implements DependencyService {

    private static final Logger logger = LoggerFactory.getLogger(DependencyServiceImpl.class);

    /** Stores the analysis results for the current project */
    private DependencyAnalysisResult analysisResult = new DependencyAnalysisResult();

    /** Temporary directory where the uploaded project is extracted */
    private Path tempProjectDir;

    /**
     * Processes the uploaded Kotlin project zip file.
     * @param file the uploaded zip file
     */
    @Override
    public void processProject(MultipartFile file) {
        try {
            // Reset analysis result for each new upload
            analysisResult = new DependencyAnalysisResult();
            tempProjectDir = Files.createTempDirectory("knit_project");

            // Extract zip contents
            unzip(file.getInputStream(), tempProjectDir);

            // Scan all Kotlin source files
            scanKotlinSources(tempProjectDir);

            // Perform analysis steps
            detectCircularDependencies();
            detectUnusedDependencies();
            detectVersionConflicts();
            enhanceGraphVisualization();

        } catch (Exception e) {
            analysisResult.errors.add("Failed to process project: " + e.getMessage());
            logger.error("Error processing project", e);
        }
    }

    /**
     * Returns the dependency analysis result after processing.
     * @return DependencyAnalysisResult containing nodes, edges, errors, and suggestions
     */
    @Override
    public DependencyAnalysisResult getDependencyGraph() {
        return analysisResult;
    }

    /**
     * Extracts the contents of a zip input stream into a target directory.
     */
    private void unzip(InputStream inputStream, Path targetDir) throws IOException {
        try (ZipInputStream zis = new ZipInputStream(inputStream)) {
            ZipEntry entry;
            while ((entry = zis.getNextEntry()) != null) {
                Path filePath = targetDir.resolve(entry.getName());
                if (entry.isDirectory()) {
                    Files.createDirectories(filePath);
                } else {
                    Files.createDirectories(filePath.getParent());
                    Files.copy(zis, filePath, StandardCopyOption.REPLACE_EXISTING);
                }
            }
        }
    }

    /**
     * Recursively scans a directory for Kotlin source files and analyzes them.
     */
    private void scanKotlinSources(Path dir) throws IOException {
        Files.walk(dir)
                .filter(path -> path.toString().endsWith(".kt"))
                .forEach(this::analyzeKotlinFile);
    }

    /**
     * Analyzes a single Kotlin file to extract DI-provided classes and dependencies.
     */
    private void analyzeKotlinFile(Path kotlinFile) {
        try {
            List<String> lines = Files.readAllLines(kotlinFile);
            String componentName = null;
            List<String> dependencies = new ArrayList<>();

            for (String line : lines) {
                // Detect @Provides annotation and class declaration
                if (line.contains("@Provides") && line.contains("class ")) {
                    int idx = line.indexOf("class ") + 6;
                    int end = line.indexOf("(", idx);
                    if (end == -1) end = line.length();
                    componentName = line.substring(idx, end).trim();
                }

                // Detect DI injected properties
                if (line.contains("by di")) {
                    String[] parts = line.split("val ");
                    if (parts.length > 1) {
                        String dep = parts[1].split(" ")[0].trim();
                        dependencies.add(dep);
                    }
                }
            }

            // Create node and edges in the graph
            if (componentName != null) {
                Map<String, Object> node = new HashMap<>();
                node.put("id", componentName);
                node.put("label", componentName);
                node.put("x", Math.random() * 600 + 100);
                node.put("y", Math.random() * 400 + 100);
                node.put("color", "default"); // severity
                node.put("issues", new ArrayList<String>());
                node.put("suggestions", new ArrayList<String>());
                analysisResult.nodes.add(node);

                for (String dep : dependencies) {
                    Map<String, Object> edge = new HashMap<>();
                    edge.put("id", componentName + "_" + dep);
                    edge.put("source", componentName);
                    edge.put("target", dep);
                    edge.put("label", componentName + "→" + dep);
                    edge.put("thickness", 1);
                    edge.put("issues", new ArrayList<String>());
                    edge.put("suggestions", new ArrayList<String>());
                    analysisResult.edges.add(edge);
                }
            }

        } catch (IOException e) {
            analysisResult.errors.add("Failed to analyze Kotlin file: " + kotlinFile + " - " + e.getMessage());
            logger.error("Error analyzing Kotlin file", e);
        }
    }

    /** --- Analysis feature scaffolds --- */

    /** Detects circular dependencies in the graph and marks them */
    private void detectCircularDependencies() {
        Map<String, List<String>> graph = new HashMap<>();
        for (Map<String, Object> edge : analysisResult.edges) {
            String source = (String) edge.get("source");
            String target = (String) edge.get("target");
            graph.computeIfAbsent(source, k -> new ArrayList<>()).add(target);
        }
        Set<String> visited = new HashSet<>();
        Set<String> stack = new HashSet<>();
        for (String node : graph.keySet()) {
            if (detectCycleDFS(node, graph, visited, stack)) {
                for (Map<String, Object> n : analysisResult.nodes) {
                    if (stack.contains(n.get("id"))) n.put("color", "red"); // critical
                }
                for (Map<String, Object> e : analysisResult.edges) {
                    if (stack.contains(e.get("source")) && stack.contains(e.get("target"))) {
                        e.put("thickness", 3);
                        ((List<String>) e.get("issues")).add("Circular dependency detected");
                    }
                }
            }
        }
    }

    /** Helper method for DFS cycle detection */
    private boolean detectCycleDFS(String node, Map<String, List<String>> graph, Set<String> visited, Set<String> stack) {
        if (stack.contains(node)) return true;
        if (visited.contains(node)) return false;
        visited.add(node);
        stack.add(node);
        List<String> neighbors = graph.getOrDefault(node, Collections.emptyList());
        for (String n : neighbors) {
            if (detectCycleDFS(n, graph, visited, stack)) return true;
        }
        stack.remove(node);
        return false;
    }

    /** Marks unused dependencies in the graph */
    private void detectUnusedDependencies() {
        Set<String> used = new HashSet<>();
        for (Map<String, Object> edge : analysisResult.edges) {
            used.add((String) edge.get("target"));
        }
        for (Map<String, Object> node : analysisResult.nodes) {
            if (!used.contains(node.get("id"))) {
                node.put("color", "orange");
                ((List<String>) node.get("issues")).add("Unused dependency");
            }
        }
    }

    /** Placeholder for version conflict detection */
    private void detectVersionConflicts() {
        // Would require external library version info
    }

    /** Placeholder for visualization enhancements */
    private void enhanceGraphVisualization() {
        // e.g., zoom, filter, export enhancements
    }
}