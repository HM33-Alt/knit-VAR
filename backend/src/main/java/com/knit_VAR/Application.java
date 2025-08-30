package com.knit_VAR;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main entry point for the Knit_VAR Spring Boot application.
 *
 * This class bootstraps the application and starts the embedded server.
 * Any configuration, controllers, and services will be automatically
 * scanned and initialized by Spring Boot.
 *
 * Portions of this code may have been assisted by GitHub Copilot.
 */
@SpringBootApplication
public class Application {

    /**
     * Main method to launch the Spring Boot application.
     *
     * @param args Command-line arguments (optional)
     */
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
