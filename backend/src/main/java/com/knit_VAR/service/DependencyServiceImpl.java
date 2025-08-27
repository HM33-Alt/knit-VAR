package com.knit_VAR.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.objectweb.asm.*;
import java.io.*;
import java.nio.file.*;
import java.util.*;
import java.util.zip.*;

@Service
public class DependencyServiceImpl implements DependencyService {

    private Map<String, List<String>> dependencyGraph = new HashMap<>();
    private Path tempProjectDir;

    @Override
    public void processProject(MultipartFile file) {
        try {
            tempProjectDir = Files.createTempDirectory("knit_project");
            unzip(file.getInputStream(), tempProjectDir);
            scanClasses(tempProjectDir);
        } catch (Exception e) {
            throw new RuntimeException("Failed to process project", e);
        }
    }

    @Override
    public Map<String, Object> getDependencyGraph() {
        return Collections.unmodifiableMap(dependencyGraph);
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

    private void scanClasses(Path dir) throws IOException {
        Files.walk(dir)
                .filter(path -> path.toString().endsWith(".class"))
                .forEach(this::analyzeClassFile);
    }

    private void analyzeClassFile(Path classFile) {
        try (InputStream in = Files.newInputStream(classFile)) {
            ClassReader reader = new ClassReader(in);
            reader.accept(new ClassVisitor(Opcodes.ASM9) {
                private String componentName;
                private List<String> dependencies = new ArrayList<>();

                @Override
                public AnnotationVisitor visitAnnotation(String desc, boolean visible) {
                    if (desc.contains("KnitComponent")) {
                        componentName = classFile.getFileName().toString();
                    }
                    return super.visitAnnotation(desc, visible);
                }

                @Override
                public FieldVisitor visitField(int access, String name, String desc, String signature, Object value) {
                    return new FieldVisitor(Opcodes.ASM9) {
                        @Override
                        public AnnotationVisitor visitAnnotation(String desc, boolean visible) {
                            if (desc.contains("KnitInject")) {
                                dependencies.add(name);
                            }
                            return super.visitAnnotation(desc, visible);
                        }
                    };
                }

                @Override
                public void visitEnd() {
                    if (componentName != null) {
                        dependencyGraph.put(componentName, new ArrayList<>(dependencies));
                    }
                }
            }, 0);
        } catch (IOException e) {
        }
    }
}