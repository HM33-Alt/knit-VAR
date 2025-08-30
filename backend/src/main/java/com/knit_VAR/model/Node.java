package com.knit_VAR.model;

/**
 * Node
 *
 * Represents a node in the dependency graph for a Kotlin file analyzed by Knit.
 * Each node corresponds to a component, service, or class in the project.
 *
 * Fields:
 * - id: a unique identifier for the node
 * - label: the display name of the node
 *
 * Getters and setters are provided for API serialization and internal manipulation.
 *
 * Portions of this file may have been assisted by GitHub Copilot.
 * All code has been reviewed and manually verified by the author.
 */
public class Node {

    /** Unique identifier for the node */
    private String id;

    /** Display name for the node */
    private String label;

    /**
     * Constructor for Node
     * @param id unique identifier
     * @param label display name
     */
    public Node(String id, String label) {
        this.id = id;
        this.label = label;
    }

    /** Getter for id */
    public String getId() {
        return id;
    }

    /** Setter for id */
    public void setId(String id) {
        this.id = id;
    }

    /** Getter for label */
    public String getLabel() {
        return label;
    }

    /** Setter for label */
    public void setLabel(String label) {
        this.label = label;
    }
}
