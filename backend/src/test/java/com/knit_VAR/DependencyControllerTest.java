package com.knit_VAR;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;

import java.io.ByteArrayOutputStream;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class DependencyControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void testUploadAndGetDependencies() throws Exception {
        // Read the compiled SampleComponent.class file from build output
        byte[] classBytes = Files.readAllBytes(
                Paths.get("target/test-classes/com/knit_VAR/SampleComponent.class"));

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        try (ZipOutputStream zos = new ZipOutputStream(baos)) {
            zos.putNextEntry(new ZipEntry("SampleComponent.class"));
            zos.write(classBytes);
            zos.closeEntry();
        }
        MockMultipartFile file = new MockMultipartFile(
                "file", "test.zip", "application/zip", baos.toByteArray());

        mockMvc.perform(multipart("/api/project").file(file))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/dependencies"))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"));
    }
}