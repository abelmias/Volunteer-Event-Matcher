package com.volunteer.config;

import com.volunteer.security.AuthTokenFilter; 
import com.volunteer.security.AuthEntryPointJwt; 

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(
        securedEnabled = true,
        jsr250Enabled = true,
        prePostEnabled = true
)
public class SecurityConfig {

    private final UserDetailsService userDetailsService;
    private final AuthTokenFilter authTokenFilter;
    private final AuthEntryPointJwt authEntryPointJwt;

    public SecurityConfig(UserDetailsService userDetailsService, AuthTokenFilter authTokenFilter, AuthEntryPointJwt authEntryPointJwt) {
        this.userDetailsService = userDetailsService;
        this.authTokenFilter = authTokenFilter;
        this.authEntryPointJwt = authEntryPointJwt;
        System.out.println("SecurityConfig initialized with UserDetailsService: " + userDetailsService.getClass().getName());
    }
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:4200", "http://localhost:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors().and()
                .csrf().disable()
                // Configure custom exception handling for unauthenticated requests (401)
                .exceptionHandling().authenticationEntryPoint(authEntryPointJwt).and() 
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS).and()
                .authenticationProvider(authenticationProvider())
                .authorizeHttpRequests(auth -> auth
                    // Public endpoints - MUST come first
                    .antMatchers("/api/auth/**").permitAll()
                    .antMatchers(HttpMethod.GET, "/api/events/**").permitAll()
                    .antMatchers(HttpMethod.GET, "/api/skills/**").permitAll()
                    .antMatchers("/", "/favicon.ico", "/**/*.png", "/**/*.gif", "/**/*.svg", "/**/*.jpg", "/**/*.html", "/**/*.css", "/**/*.js").permitAll()
                    // Role-based endpoints (all still require authentication)
                    .antMatchers(HttpMethod.POST, "/api/applications/**").hasRole("VOLUNTEER")
                    .antMatchers(HttpMethod.GET, "/api/applications/volunteer/**").hasRole("VOLUNTEER")
                    // IMPORTANT: Both VOLUNTEER and ORGANIZER can POST to /events
                    // - Volunteers submit events for admin review (status = PENDING_APPROVAL)
                    // - Organizers create events directly (status = DRAFT)
                    .antMatchers(HttpMethod.POST, "/api/events").hasAnyRole("VOLUNTEER", "ORGANIZER")
                    .antMatchers(HttpMethod.PUT, "/api/events/**").hasRole("ORGANIZER")
                    .antMatchers(HttpMethod.DELETE, "/api/events/**").hasRole("ORGANIZER")
                    .antMatchers(HttpMethod.POST, "/api/events/*/publish").hasRole("ORGANIZER")
                    .antMatchers(HttpMethod.POST, "/api/events/*/cancel").hasRole("ORGANIZER")
                    .antMatchers(HttpMethod.POST, "/api/events/*/approve").hasRole("ORGANIZER")
                    .antMatchers(HttpMethod.POST, "/api/events/*/reject").hasRole("ORGANIZER")
                    .antMatchers(HttpMethod.GET, "/api/events/organizer/my-events").hasRole("ORGANIZER")
                    .antMatchers(HttpMethod.GET, "/api/events/pending-approval").hasRole("ORGANIZER")
                    .antMatchers(HttpMethod.GET, "/api/applications/pending").hasRole("ORGANIZER")
                    .antMatchers(HttpMethod.POST, "/api/applications/*/approve").hasRole("ORGANIZER")
                    .antMatchers(HttpMethod.POST, "/api/applications/*/reject").hasRole("ORGANIZER")
                    // Admin endpoints
                    .antMatchers("/api/admin/**").hasRole("ADMIN")
                    .antMatchers(HttpMethod.POST, "/api/skills").hasRole("ADMIN")
                    .antMatchers(HttpMethod.PUT, "/api/skills/**").hasRole("ADMIN")
                    .antMatchers(HttpMethod.DELETE, "/api/skills/**").hasRole("ADMIN")
                    // All other requests require authentication
                    .anyRequest().authenticated()
                );
        
        // Register the JWT authentication filter
        http.addFilterBefore(authTokenFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
}