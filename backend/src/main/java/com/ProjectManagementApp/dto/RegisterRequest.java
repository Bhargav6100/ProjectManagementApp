package com.ProjectManagementApp.dto;

import com.ProjectManagementApp.entity.Roles;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class RegisterRequest {
    @NotBlank(message="First name cannot be empty")
    private String firstName;
    @NotBlank(message="Last name cannot be empty")
    private String lastName;
    @Email
    @NotBlank(message="email cannot be empty")
    private String email;
    @Size(min = 8, message = "Password must be at least 8 characters")
    private String password;

    @NotNull
    private Roles role;
    public String getFirstName() {
        return firstName;
    }
    public String getLastName() {
        return lastName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }
    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
    public Roles getRole() {
        return role;
    }
    public void setRole(Roles role) {
        this.role = role;
    }
}
