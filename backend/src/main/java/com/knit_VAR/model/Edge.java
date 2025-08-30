package com.knit_VAR.model;

/**
 * Edge
 *
 * Represents a directed dependency from one node to another in a dependency graph.
 * Each Edge connects a source node to a target node.
 *
 * Fields:
 * - `source`: the ID of the source node
 * - `target`: the ID of the target node
 *
 * Provides basic getters and setters for source and target fields.
 *
 * Portions of this file may have been assisted by GitHub Copilot.
 * All code has been reviewed and manually verified by the author.
 */
public class Edge {

    /** ID of the source node */
    private String source;

    /** ID of the target node */
    private String target;

    /**
     * Constructor to create an Edge between source and target nodes.
     *
     * @param source ID of the source node
     * @param target ID of the target node
     */
    public Edge(String source, String target) {
        this.source = source;
        this.target = target;
    }

    /** Returns the source node ID */
    public String getSource() {
        return source;
    }

    /** Sets the source node ID */
    public void setSource(String source) {
        this.source = source;
    }

    /** Returns the target node ID */
    public String getTarget() {
        return target;
    }

    /** Sets the target node ID */
    public void setTarget(String target) {
        this.target = target;
    }
}
