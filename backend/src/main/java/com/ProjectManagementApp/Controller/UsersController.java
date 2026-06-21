package com.ProjectManagementApp.Controller;

import com.ProjectManagementApp.dto.UserResponse;
import com.ProjectManagementApp.entity.User;
import com.ProjectManagementApp.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
@RestController
@RequestMapping("/api/users")
public class UsersController {

    private UserRepository userRepository;

    public  UsersController(UserRepository userRepository){
        this.userRepository=userRepository;
    }
    @GetMapping("/me")
    public ResponseEntity<UserResponse> me(Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow();

        UserResponse response = new UserResponse(
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getRole()
        );

        return ResponseEntity.ok(response);
    }
}
