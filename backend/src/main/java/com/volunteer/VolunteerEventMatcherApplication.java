package com.volunteer;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

/**
 * Main Spring Boot application class for Volunteer Event Matcher.
 * 
 * This application provides a REST API for volunteer event discovery,
 * management, and commitment tracking.
 */
@SpringBootApplication
public class VolunteerEventMatcherApplication {

    /**
     * Main entry point for the Spring Boot application.
     * 
     * @param args command line arguments
     */
    public static void main(String[] args) {
        SpringApplication.run(VolunteerEventMatcherApplication.class, args);
    }

    /**
     * Configures CORS (Cross-Origin Resource Sharing) for the application.
     * 
     * This allows the Angular frontend to communicate with the Spring Boot backend.
     * 
     * @return CorsFilter configured with allowed origins and methods
     */
    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        
        config.setAllowCredentials(true);
        config.addAllowedOrigin("http://localhost:4200");
        config.addAllowedOrigin("http://localhost:3000");
        config.addAllowedHeader("*");
        config.addAllowedMethod("GET");
        config.addAllowedMethod("POST");
        config.addAllowedMethod("PUT");
        config.addAllowedMethod("DELETE");
        config.addAllowedMethod("OPTIONS");
        
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}
