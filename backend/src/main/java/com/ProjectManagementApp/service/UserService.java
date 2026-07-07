package com.ProjectManagementApp.service;

import com.ProjectManagementApp.dto.UserRequest;
import com.ProjectManagementApp.dto.UserResponse;
import com.ProjectManagementApp.dto.ResetPasswordRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.ProjectManagementApp.entity.User;
import com.ProjectManagementApp.exception.ResourceNotFoundException;
import com.ProjectManagementApp.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Service
@RequestMapping("/api/users")
public class UserService {
 private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }
    @GetMapping("/{id}")
    public UserResponse findUserById(@PathVariable long id){
        User user = userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User not found"));
         return new UserResponse(
                 user.getId(),
                 user.getFirstName(),
                 user.getLastName(),
                 user.getEmail(),
                 user.getRole(),
                 user.getCreatedAt(),
                 user.isActive()
         );
    }
    @PutMapping("/{id}")
    public UserResponse updateUser(UserRequest request,@PathVariable long id){
        User user = userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User not found"));
                user.setFirstName(request.getFirstName());
                user.setLastName(request.getLastName());
                user.setEmail(request.getEmail());
                user.setRole(request.getRole());
          User updated = userRepository.save(user);
        return new UserResponse(
                updated.getId(),
                updated.getFirstName(),
                updated.getLastName(),
                updated.getEmail(),
                updated.getRole(),
                updated.getCreatedAt(),
                updated.isActive()
        );
    }
    public void resetPasswordByAdmin(Long userId, ResetPasswordRequest request) {
        if (request.getNewPassword() == null || request.getNewPassword().isBlank()) {
            throw new RuntimeException("New password is required");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));

        userRepository.save(user);
    }
}
