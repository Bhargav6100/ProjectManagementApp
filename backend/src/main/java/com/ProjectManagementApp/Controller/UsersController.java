package com.ProjectManagementApp.Controller;

import com.ProjectManagementApp.dto.UserResponse;
import com.ProjectManagementApp.entity.User;
import com.ProjectManagementApp.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getRole()
        );

        return ResponseEntity.ok(response);
    }
    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    @GetMapping("/{id}")
    public User getUserById(@PathVariable Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
    @DeleteMapping("/{id}")
    public String deleteUsersById(@PathVariable Long id){
        userRepository.deleteById(id);
     return "User deleted successfully";
    }
}
