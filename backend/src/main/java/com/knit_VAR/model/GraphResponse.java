package com.knit_VAR.model;

import java.util.List;

/**
 * GraphResponse
 *
 * Represents the result of a dependency graph analysis.
 * Contains a list of nodes and a list of edges connecting them.
 * This object is returned by API endpoints that provide graph data.
 *
 * Fields:
 * - `nodes`: a list of Node objects representing elements in the graph
 * - `edges`: a list of Edge objects representing dependencies between nodes
 *
 * Provides basic constructors, getters, and setters for API serialization and manipulation.
 *
 * Portions of this file may have been assisted by GitHub Copilot.
 * All code has been reviewed and manually verified by the author.
 */
public class GraphResponse {

    /** List of nodes in the graph */
    private List<Node> nodes;

    /** List of edges representing dependencies between nodes */
    private List<Edge> edges;

    /**
     * Constructor to create a GraphResponse with nodes and edges.
     *
     * @param nodes List of Node objects
     * @param edges List of Edge objects
     */
    public GraphResponse(List<Node> nodes, List<Edge> edges) {
        this.nodes = nodes;
        this.edges = edges;
    }

    /** Returns the list of nodes */
    public List<Node> getNodes() {
        return nodes;
    }

    /** Sets the list of nodes */
    public void setNodes(List<Node> nodes) {
        this.nodes = nodes;
    }

    /** Returns the list of edges */
    public List<Edge> getEdges() {
        return edges;
    }

    /** Sets the list of edges */
    public void setEdges(List<Edge> edges) {
        this.edges = edges;
    }
}
