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

@Service
public class KnitAnalyzer {

    public KnitAnalysisResult analyzeFull(MultipartFile file) {
        try {
            String content = new BufferedReader(new InputStreamReader(file.getInputStream()))
                    .lines().collect(Collectors.joining("\n"));

            List<Node> nodes = new ArrayList<>();
            List<Edge> edges = new ArrayList<>();
            List<String> dependencies = new ArrayList<>();
            List<String> errors = new ArrayList<>();
            List<String> suggestions = new ArrayList<>();

            boolean hasProvides = content.contains("@Provides");
            boolean hasDi = content.contains("by di");

            if (hasProvides) {
                nodes.add(new Node("provides", "@Provides"));
                suggestions.add("Consider reviewing @Provides usage.");
            }
            if (hasDi) {
                nodes.add(new Node("di", "by di"));
                suggestions.add("Check DI implementation.");
            }
            if (hasProvides && hasDi) {
                edges.add(new Edge("provides", "di"));
                dependencies.add("provides -> di");
            }
            if (!hasProvides && !hasDi) {
                errors.add("No @Provides or DI found.");
            }

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
            throw new RuntimeException("Failed to analyze file", e);
        }
    }
}