package com.volunteer.controller;

import com.volunteer.dto.AuthResponseDTO;
import com.volunteer.dto.UserLoginDTO;
import com.volunteer.dto.UserRegistrationDTO;
import com.volunteer.dto.UserDTO;
import com.volunteer.entity.User;
import com.volunteer.service.UserService;
import com.volunteer.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody UserRegistrationDTO registrationDTO) {
        try {
            UserDTO userDTO = userService.registerUser(registrationDTO);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(AuthResponseDTO.builder()
                            .user(userDTO)
                            .message("User registered successfully")
                            .build());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(AuthResponseDTO.builder()
                            .message(e.getMessage())
                            .build());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody UserLoginDTO loginDTO) {
        try {
            log.info("========== LOGIN ATTEMPT ==========");
            log.info("Username/Email: {}", loginDTO.getUsernameOrEmail());
            log.info("Password provided: {}", loginDTO.getPassword() != null && !loginDTO.getPassword().isEmpty());
            
            User user = userService.findByUsername(loginDTO.getUsernameOrEmail())
                    .orElseGet(() -> userService.findByEmail(loginDTO.getUsernameOrEmail())
                            .orElse(null));

            if (user == null) {
                log.error("❌ USER NOT FOUND: {}", loginDTO.getUsernameOrEmail());
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(AuthResponseDTO.builder()
                                .message("Invalid credentials")
                                .build());
            }

            log.info("✅ User found: {} (ID: {})", user.getUsername(), user.getId());
            log.info("Stored password hash: {}", user.getPasswordHash().substring(0, Math.min(20, user.getPasswordHash().length())) + "...");
            
            boolean passwordMatches = passwordEncoder.matches(loginDTO.getPassword(), user.getPasswordHash());
            log.info("Password match result: {}", passwordMatches);

            if (!passwordMatches) {
                log.error("❌ PASSWORD MISMATCH for user: {}", user.getUsername());
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(AuthResponseDTO.builder()
                                .message("Invalid credentials")
                                .build());
            }
            
            log.info("✅ PASSWORD MATCH - proceeding with authentication");

            // Authenticate user and generate JWT token
            log.debug("Authenticating user with AuthenticationManager");
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(user.getUsername(), loginDTO.getPassword())
            );
            String token = jwtTokenProvider.generateToken(authentication);
            log.info("JWT token generated successfully for user: {}", user.getUsername());

            UserDTO userDTO = UserDTO.builder()
                    .id(user.getId())
                    .username(user.getUsername())
                    .email(user.getEmail())
                    .firstName(user.getFirstName())
                    .lastName(user.getLastName())
                    .role(user.getRole())
                    .build();

            return ResponseEntity.ok(AuthResponseDTO.builder()
                    .token(token)
                    .user(userDTO)
                    .message("Login successful")
                    .build());
        } catch (Exception e) {
            log.error("Login failed", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(AuthResponseDTO.builder()
                            .message("Login failed: " + e.getMessage())
                            .build());
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        return ResponseEntity.ok(AuthResponseDTO.builder()
                .message("Logout successful")
                .build());
    }
}
