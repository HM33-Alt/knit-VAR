package com.knit_VAR.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.objectweb.asm.*;
import java.io.*;
import java.nio.file.*;
import java.util.*;
import java.util.zip.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.knit_VAR.dto.DependencyAnalysisResult;

@Service
public class DependencyServiceImpl implements DependencyService {

    private static final Logger logger = LoggerFactory.getLogger(DependencyServiceImpl.class);
    private DependencyAnalysisResult analysisResult = new DependencyAnalysisResult();
    private Path tempProjectDir;

    @Override
    public void processProject(MultipartFile file) {
        try {
            analysisResult = new DependencyAnalysisResult();
            tempProjectDir = Files.createTempDirectory("knit_project");
            unzip(file.getInputStream(), tempProjectDir);
            scanKotlinSources(tempProjectDir); // Use this instead of scanClasses
        } catch (Exception e) {
            analysisResult.errors.add("Failed to process project: " + e.getMessage());
        }
    }

    @Override
    public DependencyAnalysisResult getDependencyGraph() {
        return analysisResult;
    }

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

    private void scanKotlinSources(Path dir) throws IOException {
        Files.walk(dir)
                .filter(path -> path.toString().endsWith(".kt"))
                .forEach(this::analyzeKotlinFile);
    }

    private void analyzeKotlinFile(Path kotlinFile) {
        try {
            List<String> lines = Files.readAllLines(kotlinFile);
            String componentName = null;
            List<String> dependencies = new ArrayList<>();

            for (String line : lines) {
                if (line.contains("@Provides")) {
                    if (line.contains("class ")) {
                        int idx = line.indexOf("class ") + 6;
                        int end = line.indexOf("(", idx);
                        if (end == -1) end = line.length();
                        componentName = line.substring(idx, end).trim();
                    }
                }
                if (line.contains("by di")) {
                    String[] parts = line.split("val ");
                    if (parts.length > 1) {
                        String dep = parts[1].split(" ")[0].trim();
                        dependencies.add(dep);
                    }
                }
            }

            if (componentName != null) {
                Map<String, Object> node = new HashMap<>();
                node.put("id", componentName);
                node.put("label", componentName);
                node.put("x", Math.random() * 600 + 100);
                node.put("y", Math.random() * 400 + 100);
                node.put("issues", new ArrayList<String>());
                node.put("suggestions", new ArrayList<String>());
                analysisResult.nodes.add(node);

                for (String dep : dependencies) {
                    Map<String, Object> edge = new HashMap<>();
                    edge.put("id", componentName + "_" + dep);
                    edge.put("source", componentName);
                    edge.put("target", dep);
                    edge.put("label", componentName + "→" + dep);
                    edge.put("issues", new ArrayList<String>());
                    edge.put("suggestions", new ArrayList<String>());
                    analysisResult.edges.add(edge);
                }
            }
        } catch (IOException e) {
            analysisResult.errors.add("Failed to analyze Kotlin file: " + kotlinFile + " - " + e.getMessage());
        }
    }
}