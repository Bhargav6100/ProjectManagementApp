package com.ProjectManagementApp.Controller;

import com.ProjectManagementApp.dto.*;
import com.ProjectManagementApp.entity.User;
import com.ProjectManagementApp.repository.UserRepository;
import com.ProjectManagementApp.service.ProjectService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import org.springframework.security.access.AccessDeniedException;
import com.ProjectManagementApp.exception.ResourceNotFoundException;
import java.util.List;

@RestController
public class ProjectController {
    private final ProjectService projectService;
    private final UserRepository userRepository;

    public ProjectController(ProjectService projectService, UserRepository userRepository) {
        this.projectService = projectService;
        this.userRepository = userRepository;
    }
    private User getCurrentUser(Authentication authentication) {
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
    @PostMapping("/api/workspaces/{workspaceId}/projects")
    public ResponseEntity<ProjectResponse> createProject(
            @PathVariable Long workspaceId,
            @Valid @RequestBody ProjectRequest request,
            Authentication authentication) throws AccessDeniedException {

        User currentUser = getCurrentUser(authentication);
        return ResponseEntity.ok(projectService.createProject(request, workspaceId, currentUser));
    }

    @GetMapping("/api/workspaces/{workspaceId}/projects")
    public ResponseEntity<List<ProjectResponse>> findAllProjectsByWorkSpaceId(
            @PathVariable Long workspaceId,
            Authentication authentication) throws AccessDeniedException {

        User currentUser = getCurrentUser(authentication);
        return ResponseEntity.ok(projectService.getAllProjectsbyWorkspaceId(workspaceId, currentUser));
    }

    @GetMapping("/api/projects/{id}")
    public ResponseEntity<ProjectResponse> findProjectById(
            @PathVariable Long id,
            Authentication authentication) throws AccessDeniedException {

        User currentUser = getCurrentUser(authentication);
        return ResponseEntity.ok(projectService.getProjectById(id, currentUser));
    }

    @GetMapping("/api/projects/my-projects")
    public ResponseEntity<List<ProjectResponse>> getMyProjects(Authentication authentication) {

        User currentUser = getCurrentUser(authentication);
        return ResponseEntity.ok(projectService.getMyProjects(currentUser));
    }

    @PutMapping("/api/projects/{projectId}")
    public ResponseEntity<ProjectResponse> updateProject(
            @PathVariable Long projectId,
            @Valid @RequestBody ProjectRequest request,
            Authentication authentication) throws AccessDeniedException {

        User currentUser = getCurrentUser(authentication);
        return ResponseEntity.ok(projectService.updateProject(request, projectId, currentUser));
    }

    @PatchMapping("/api/projects/{projectId}/status")
    public ResponseEntity<ProjectResponse> updateProjectStatus(
            @PathVariable Long projectId,
            @Valid @RequestBody ProjectStatusPatch request,
            Authentication authentication) throws AccessDeniedException {

        User currentUser = getCurrentUser(authentication);
        return ResponseEntity.ok(projectService.updateProjectStatus(request, projectId, currentUser));
    }

    @DeleteMapping("/api/projects/{projectId}")
    public ResponseEntity<String> deleteProject(
            @PathVariable Long projectId,
            Authentication authentication) throws AccessDeniedException {

        User currentUser = getCurrentUser(authentication);
        return ResponseEntity.ok(projectService.deleteProject(projectId, currentUser));
    }
}
