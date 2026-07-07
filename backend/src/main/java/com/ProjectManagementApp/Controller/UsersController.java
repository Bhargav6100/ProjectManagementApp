package com.ProjectManagementApp.Controller;

import com.ProjectManagementApp.dto.UserRequest;
import com.ProjectManagementApp.dto.UserResponse;
import com.ProjectManagementApp.entity.User;
import com.ProjectManagementApp.repository.UserRepository;
import com.ProjectManagementApp.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UsersController {

    private UserRepository userRepository;
    
    private UserService userService;

    public  UsersController(UserRepository userRepository, UserService userService){
        this.userRepository=userRepository;
        this.userService = userService;
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
    public UserResponse getUserById(@PathVariable Long id) {
        return userService.findUserById(id);
    }
    @PutMapping("/{id}")
    public UserResponse updateUser(@PathVariable Long id,@Valid @RequestBody UserRequest request){
        return userService.updateUser(request,id);
    }
    @DeleteMapping("/{id}")
    public String deleteUsersById(@PathVariable Long id){
        userRepository.deleteById(id);
     return "User deleted successfully";
    }
}
