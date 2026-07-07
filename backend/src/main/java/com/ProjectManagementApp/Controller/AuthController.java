package com.ProjectManagementApp.Controller;

import com.ProjectManagementApp.dto.AuthResponse;
import com.ProjectManagementApp.dto.LoginRequest;
import com.ProjectManagementApp.dto.RegisterRequest;
import com.ProjectManagementApp.dto.ResetPasswordRequest;
import com.ProjectManagementApp.entity.User;
import com.ProjectManagementApp.repository.UserRepository;
import com.ProjectManagementApp.security.JwtService;
import com.ProjectManagementApp.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final UserService userService;
    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService, UserService userService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body("Email already exists");
        }

        User user = new User();

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        user.setCreatedAt(LocalDateTime.now());

        userRepository.save(user);

        return ResponseEntity.ok("User registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail()).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().body("Invalid email or password");
        }
        if (!user.isActive()) {
            throw new RuntimeException("User account is deactivated");
        }
        boolean matches = passwordEncoder.matches(request.getPassword(), user.getPassword());
        if (!matches) {
            return ResponseEntity.badRequest().body("Invalid email or password");
        }
        String token=jwtService.generateToken(user);

        return ResponseEntity.ok(new AuthResponse(token));
    }
    @PatchMapping("/users/{userId}/reset-password")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> resetPassword(
            @PathVariable Long userId,
            @RequestBody ResetPasswordRequest request
    ) {
        userService.resetPasswordByAdmin(userId, request);
        return ResponseEntity.ok("Password reset successfully");
    }
}