package com.knit_VAR.model;

import java.util.List;

public class KnitAnalysisResult {
    private boolean hasProvides;
    private boolean hasDi;
    private List<String> dependencies;
    private List<String> errors;
    private List<String> suggestions;

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
}