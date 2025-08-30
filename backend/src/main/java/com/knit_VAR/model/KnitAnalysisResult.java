package com.knit_VAR.model;

import java.util.List;

/**
 * KnitAnalysisResult
 *
 * Represents the analysis results of a Kotlin file processed by the Knit dependency analyzer.
 * Contains information about detected dependencies, errors, suggestions, and the graph representation.
 *
 * Fields:
 * - hasProvides: true if the file contains @Provides annotations
 * - hasDi: true if the file uses dependency injection
 * - dependencies: list of dependency names identified in the file
 * - errors: list of detected issues
 * - suggestions: list of suggested improvements
 * - nodes: list of Node objects representing the dependency graph
 * - edges: list of Edge objects representing relationships between nodes
 *
 * Getters and setters are provided for API serialization and internal manipulation.
 *
 * Portions of this file may have been assisted by GitHub Copilot.
 * All code has been reviewed and manually verified by the author.
 */
public class KnitAnalysisResult {

    /** Indicates if @Provides annotations are present */
    private boolean hasProvides;

    /** Indicates if dependency injection is used */
    private boolean hasDi;

    /** List of dependency names identified */
    private List<String> dependencies;

    /** List of detected errors in the file */
    private List<String> errors;

    /** List of suggestions for improvement */
    private List<String> suggestions;

    /** Nodes representing the graph of dependencies */
    private List<Node> nodes;

    /** Edges representing dependency relationships */
    private List<Edge> edges;

    // Getters and setters

    public boolean isHasProvides() { return hasProvides; }
    public void setHasProvides(boolean hasProvides) { this.hasProvides = hasProvides; }

    public boolean isHasDi() { return hasDi; }
    public void setHasDi(boolean hasDi) { this.hasDi = hasDi; }

    public List<String> getDependencies() { return dependencies; }
    public void setDependencies(List<String> dependencies) { this.dependencies = dependencies; }

    public List<String> getErrors() { return errors; }
    public void setErrors(List<String> errors) { this.errors = errors; }

    public List<String> getSuggestions() { return suggestions; }
    public void setSuggestions(List<String> suggestions) { this.suggestions = suggestions; }

    public List<Node> getNodes() { return nodes; }
    public void setNodes(List<Node> nodes) { this.nodes = nodes; }

    public List<Edge> getEdges() { return edges; }
    public void setEdges(List<Edge> edges) { this.edges = edges; }
}
