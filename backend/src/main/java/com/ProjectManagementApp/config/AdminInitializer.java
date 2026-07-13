package com.ProjectManagementApp.config;

import com.ProjectManagementApp.entity.Roles;
import com.ProjectManagementApp.entity.User;
import com.ProjectManagementApp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class AdminInitializer implements CommandLineRunner {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.first-name}")
    private String adminFirstName;

    @Value("${app.admin.last-name}")
    private String adminLastName;

    @Value("${app.admin.email}")
    private String adminEmail;

    @Value("${app.admin.password}")
    private String adminPassword;

    public AdminInitializer(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }
    @Override
    public void run(String... args) throws Exception {
        boolean adminExists = userRepository.existsByRole(Roles.ADMIN);

        if (adminExists) {
            return;
        }

        if (userRepository.existsByEmail(adminEmail)) {
            throw new RuntimeException("Admin email already exists but no ADMIN role found.");
        }

        User admin = new User();
        admin.setFirstName(adminFirstName);
        admin.setLastName(adminLastName);
        admin.setEmail(adminEmail);
        admin.setPassword(passwordEncoder.encode(adminPassword));
        admin.setRole(Roles.ADMIN);
        admin.setActive(true);
        admin.setCreatedAt(LocalDateTime.now());

        userRepository.save(admin);

        System.out.println("Default admin user created successfully.");
    }
    }

