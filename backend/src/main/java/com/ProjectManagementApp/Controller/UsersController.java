package com.ProjectManagementApp.Controller;

import com.ProjectManagementApp.dto.UserRequest;
import com.ProjectManagementApp.dto.UserResponse;
import com.ProjectManagementApp.entity.User;
import com.ProjectManagementApp.exception.ResourceNotFoundException;
import com.ProjectManagementApp.repository.UserRepository;
import com.ProjectManagementApp.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UsersController {

    private final UserRepository userRepository;
    private final UserService userService;
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
                user.getRole(),
                user.getCreatedAt(),
                user.isActive()
        );

        return ResponseEntity.ok(response);
    }
    private UserResponse mapToUserResponse(User user) {
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
    @GetMapping("/active")
    public List<UserResponse> getAllActiveUsers() {
        return userRepository.findByActiveTrue()
                .stream()
                .map(this::mapToUserResponse)
                .toList();
    }
    @GetMapping("/inactive")
    public List<UserResponse> getAllInactiveUsers(){
        return userRepository.findByActiveFalse()
                .stream()
                .map(this::mapToUserResponse)
                .toList();
    }
    @PatchMapping ("/{id}")
    public String changeStatusOfUser(@PathVariable Long id){
        User user = userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setActive(!user.isActive());
        userRepository.save(user);
        return "Selected User has status of " + user.isActive() + "now";
    }
    @GetMapping("/{id}")
    public UserResponse getUserById(@PathVariable Long id) {
        return userService.findUserById(id);
    }
    @PutMapping("/{id}")
    public UserResponse updateUser(@PathVariable Long id,@Valid @RequestBody UserRequest request){
        return userService.updateUser(request,id);
    }
   @Transactional
    @DeleteMapping("/{id}")
    public String deleteUsersById(@PathVariable Long id){
       User user = userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User not found"));
       user.setActive(false);
       userRepository.save(user);
       return "User deleted successfully";
    }
}
