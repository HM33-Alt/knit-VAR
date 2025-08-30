package com.knit_VAR.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * HealthCheckController
 *
 * Provides a simple endpoint for health checking the application.
 *
 * Portions of this file may have been assisted by GitHub Copilot.
 * All code has been reviewed and manually verified by the author.
 */
@RestController
public class HealthCheckController {

    /**
     * GET /api/health
     *
     * Returns a simple "OK" string to indicate that the backend service is running.
     * This can be used by monitoring tools or load balancers for health checks.
     *
     * @return String "OK" if the service is healthy
     */
    @GetMapping("/api/health")
    public String healthCheck() {
        return "OK";
    }
}
