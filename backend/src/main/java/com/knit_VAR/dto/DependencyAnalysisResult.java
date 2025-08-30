package com.knit_VAR.dto;

import java.util.*;

/**
 * DependencyAnalysisResult
 *
 * Data Transfer Object (DTO) that represents the result of a dependency analysis.
 *
 * - `nodes`: a list of maps representing nodes in the dependency graph. Each node map may include:
 *     - id (String): unique identifier for the node
 *     - label (String): human-readable name
 *     - other metadata such as issues, suggestions, position, severity, etc.
 * - `edges`: a list of maps representing edges between nodes. Each edge map may include:
 *     - source (String): source node ID
 *     - target (String): target node ID
 *     - label (String): description of the dependency
 *     - other metadata such as issues, suggestions, thickness, etc.
 * - `errors`: a list of error messages encountered during analysis
 * - `suggestions`: a list of general suggestions to improve the project or resolve issues
 *
 * Portions of this file may have been assisted by GitHub Copilot.
 * All code has been reviewed and manually verified by the author.
 */
public class DependencyAnalysisResult {

    /** List of nodes in the dependency graph */
    public List<Map<String, Object>> nodes = new ArrayList<>();

    /** List of edges representing dependencies between nodes */
    public List<Map<String, Object>> edges = new ArrayList<>();

    /** Errors encountered during the analysis */
    public List<String> errors = new ArrayList<>();

    /** Suggestions generated from the analysis */
    public List<String> suggestions = new ArrayList<>();
}
