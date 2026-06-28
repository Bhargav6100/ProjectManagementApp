package com.ProjectManagementApp.Controller;

import com.ProjectManagementApp.dto.WorkspaceMemberResponse;
import com.ProjectManagementApp.dto.WorkspaceRequest;
import com.ProjectManagementApp.dto.WorkspaceResponse;
import com.ProjectManagementApp.entity.User;
import com.ProjectManagementApp.repository.UserRepository;
import com.ProjectManagementApp.service.WorkspaceService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
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

    @PostMapping
    public ResponseEntity<WorkspaceResponse> createWorkspace(
            @Valid @RequestBody WorkspaceRequest request,
            Authentication authentication
    ) throws AccessDeniedException {
        String email = authentication.getName();

        User currentUser = userRepository.findByEmail(email)
                .orElseThrow();

        WorkspaceResponse response = workspaceService.createWorkspace(request, currentUser);

        return ResponseEntity.ok(response);
    }
    @GetMapping
    public List<WorkspaceResponse> getAllWorkspace(Authentication authentication) throws AccessDeniedException {
        String email =authentication.getName();
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow();
        return workspaceService.getAllWorkspace(currentUser);
    }
    @GetMapping("/my-workspaces")
    public List<WorkspaceMemberResponse> getMyWorkspaces(Authentication authentication) throws AccessDeniedException {
        String email =authentication.getName();
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow();
        return workspaceService.getMyWorkspaces(currentUser);
    }
    @GetMapping("/{id}")
    public WorkspaceResponse getWorkspaceById(@PathVariable Long id,
                                              Authentication authentication) throws AccessDeniedException {
        String email =authentication.getName();
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow();
        return workspaceService.getWorkspaceById(id,currentUser);
    }
    @PutMapping("/{workspaceId}")
    public ResponseEntity<WorkspaceResponse>
    updateWorkspace( @PathVariable Long workspaceId,@Valid @RequestBody WorkspaceRequest request,
                     Authentication authentication) throws AccessDeniedException {
         String email =authentication.getName();
         User currentUser = userRepository.findByEmail(email)
                 .orElseThrow();

         WorkspaceResponse response = workspaceService.updateWorkspace(request,workspaceId,currentUser);
       return ResponseEntity.ok(response);
    }
    @DeleteMapping("/{workspaceId}")
    public String deleteWorkspace(@PathVariable Long workspaceId,Authentication authentication) throws AccessDeniedException {
        String email =authentication.getName();
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow();
        return workspaceService.deleteWorkspace(workspaceId,currentUser);
    }
}