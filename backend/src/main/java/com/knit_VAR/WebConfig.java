package com.knit_VAR;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Web configuration class for the Knit_VAR application.
 *
 * Configures CORS (Cross-Origin Resource Sharing) to allow
 * frontend requests from specific origins.
 *
 * Portions of this code may have been assisted by GitHub Copilot.
 * All code has been reviewed and manually verified by the author.
 */
@Configuration
public class WebConfig {

    /**
     * Bean that configures CORS settings for the application.
     *
     * - Allows requests to /api/** endpoints
     * - Permits requests from http://localhost:3000 (React frontend)
     * - Allows POST, GET, and OPTIONS HTTP methods
     *
     * @return a configured WebMvcConfigurer instance
     */
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOrigins("http://localhost:3000") // Please amend if your frontend runs on a different port
                        .allowedMethods("POST", "GET", "OPTIONS");
            }
        };
    }
}
