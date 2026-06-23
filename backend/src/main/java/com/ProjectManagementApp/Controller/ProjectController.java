package com.ProjectManagementApp.Controller;

import com.ProjectManagementApp.dto.ProjectRequest;
import com.ProjectManagementApp.entity.User;
import com.ProjectManagementApp.repository.UserRepository;
import com.ProjectManagementApp.service.ProjectService;
import com.ProjectManagementApp.dto.ProjectResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

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
          @RequestBody ProjectRequest request,
          Authentication authentication
  ) {
      String email = authentication.getName();

      User currentUser = userRepository.findByEmail(email)
              .orElseThrow();

      ProjectResponse response = projectService.createProject(request, workspaceId,currentUser);

      return ResponseEntity.ok(response);
  }
}
