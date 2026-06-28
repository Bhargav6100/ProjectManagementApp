package com.ProjectManagementApp.Controller;

import com.ProjectManagementApp.dto.*;
import com.ProjectManagementApp.entity.User;
import com.ProjectManagementApp.repository.UserRepository;
import com.ProjectManagementApp.service.ProjectService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.util.List;

@RestController
@RequestMapping("/api/workspaces")
public class ProjectController {
    private final ProjectService projectService;
    private final UserRepository userRepository;

    public ProjectController(ProjectService projectService, UserRepository userRepository) {
        this.projectService = projectService;
        this.userRepository = userRepository;
    }
  @PostMapping("/{workspaceId}/projects")
  public ResponseEntity<ProjectResponse> createProject(
          @PathVariable Long workspaceId,
          @Valid @RequestBody ProjectRequest request,
          Authentication authentication
  ) throws AccessDeniedException {
      String email = authentication.getName();

      User currentUser = userRepository.findByEmail(email)
              .orElseThrow();

      ProjectResponse response = projectService.createProject(request, workspaceId,currentUser);

      return ResponseEntity.ok(response);
  }
  @GetMapping("/{workspaceId}/projects")
    public ResponseEntity<List<ProjectResponse>> findAllProjectsByWorkSpaceId(@PathVariable Long workspaceId,Authentication authentication) throws AccessDeniedException {
      String email = authentication.getName();

      User currentUser = userRepository.findByEmail(email)
              .orElseThrow();

      return ResponseEntity.ok(projectService.getAllProjectsbyWorkspaceId(workspaceId,currentUser));
  }
    @GetMapping("/projects/{id}")
    public ProjectResponse findProjectById(@PathVariable Long id,Authentication authentication) throws AccessDeniedException {
        String email = authentication.getName();

        User currentUser = userRepository.findByEmail(email)
                .orElseThrow();


        return projectService.getProjectById(id,currentUser);
    }
    @GetMapping("/projects/my-projects")
    public ResponseEntity<List<ProjectResponse>> getMyProjects(Authentication authentication) {

        String email = authentication.getName();

        User currentUser = userRepository.findByEmail(email)
                .orElseThrow();

        return ResponseEntity.ok(projectService.getMyProjects(currentUser));
    }
   @PutMapping("/projects/{projectId}")
   public ResponseEntity<ProjectResponse> updateProject(@PathVariable Long projectId,
                                                        @Valid @RequestBody ProjectRequest request,
                                                        Authentication authentication) throws AccessDeniedException {
       String email =authentication.getName();
       User currentUser = userRepository.findByEmail(email)
               .orElseThrow();

       ProjectResponse response = projectService.updateProject(request,projectId,currentUser);
       return ResponseEntity.ok(response);
   }
    @PatchMapping("/projects/{projectId}/status")
    public ResponseEntity<ProjectResponse> updateProjectStatus(@PathVariable Long projectId, @Valid @RequestBody ProjectStatusPatch request,
            Authentication authentication) throws AccessDeniedException {

        String email = authentication.getName();
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow();
        return ResponseEntity.ok(projectService.updateProjectStatus(request, projectId, currentUser)
        );
    }
    @DeleteMapping("/projects/{projectId}")
    public String deleteProject(@PathVariable Long projectId,Authentication authentication) throws AccessDeniedException {
        String email = authentication.getName();
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow();
        return projectService.deleteProject(projectId,currentUser);
    }
}
