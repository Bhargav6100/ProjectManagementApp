package com.ProjectManagementApp.Controller;

import com.ProjectManagementApp.dto.WorkspaceRequest;
import com.ProjectManagementApp.dto.WorkspaceResponse;
import com.ProjectManagementApp.entity.User;
import com.ProjectManagementApp.exception.ResourceNotFoundException;
import com.ProjectManagementApp.repository.UserRepository;
import com.ProjectManagementApp.service.WorkspaceService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@RestController
@RequestMapping("/api/workspaces")
public class WorkspaceController {

    private final WorkspaceService workspaceService;
    private final UserRepository userRepository;

    public WorkspaceController(
            WorkspaceService workspaceService,
            UserRepository userRepository
    ) {
        this.workspaceService = workspaceService;
        this.userRepository = userRepository;
    }
    private User getCurrentUser(Authentication authentication) {
        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
    @PostMapping
    public ResponseEntity<WorkspaceResponse> createWorkspace(
            @Valid @RequestBody WorkspaceRequest request,
            Authentication authentication) throws AccessDeniedException {

        User currentUser = getCurrentUser(authentication);
        return ResponseEntity.ok(
                workspaceService.createWorkspace(request, currentUser)
        );
    }

    @GetMapping
    public ResponseEntity<List<WorkspaceResponse>> getAllWorkspace(
            Authentication authentication) throws AccessDeniedException {

        User currentUser = getCurrentUser(authentication);
        return ResponseEntity.ok(
                workspaceService.getAllWorkspace(currentUser)
        );
    }

    @GetMapping("/my-workspaces")
    public ResponseEntity<List<WorkspaceResponse>> getMyWorkspaces(
            Authentication authentication) {

        User currentUser = getCurrentUser(authentication);
        return ResponseEntity.ok(
                workspaceService.getMyWorkspaces(currentUser)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<WorkspaceResponse> getWorkspaceById(
            @PathVariable Long id,
            Authentication authentication) throws AccessDeniedException {

        User currentUser = getCurrentUser(authentication);
        return ResponseEntity.ok(
                workspaceService.getWorkspaceById(id, currentUser)
        );
    }

    @PutMapping("/{workspaceId}")
    public ResponseEntity<WorkspaceResponse> updateWorkspace(
            @PathVariable Long workspaceId,
            @Valid @RequestBody WorkspaceRequest request,
            Authentication authentication) throws AccessDeniedException {

        User currentUser = getCurrentUser(authentication);
        return ResponseEntity.ok(
                workspaceService.updateWorkspace(request, workspaceId, currentUser)
        );
    }

    @DeleteMapping("/{workspaceId}")
    public ResponseEntity<String> deleteWorkspace(
            @PathVariable Long workspaceId,
            Authentication authentication) throws AccessDeniedException {

        User currentUser = getCurrentUser(authentication);
        return ResponseEntity.ok(
                workspaceService.deleteWorkspace(workspaceId, currentUser)
        );
    }
}