package com.knit_VAR.dto;

import java.util.*;

public class DependencyAnalysisResult {
    public List<Map<String, Object>> nodes = new ArrayList<>();
    public List<Map<String, Object>> edges = new ArrayList<>();
    public List<String> errors = new ArrayList<>();
    public List<String> suggestions = new ArrayList<>();
}