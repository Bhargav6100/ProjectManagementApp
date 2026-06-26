package com.ProjectManagementApp.service;

import com.ProjectManagementApp.dto.ProjectRequest;
import com.ProjectManagementApp.dto.ProjectResponse;
import com.ProjectManagementApp.dto.ProjectStatusPatch;
import com.ProjectManagementApp.entity.Project;
import com.ProjectManagementApp.entity.User;
import com.ProjectManagementApp.entity.Workspace;
import com.ProjectManagementApp.repository.ProjectRepository;
import com.ProjectManagementApp.repository.WorkSpaceRepository;
import com.ProjectManagementApp.repository.WorkspaceMemberRepository;
import com.ProjectManagementApp.entity.Roles;
import org.springframework.stereotype.Service;

import java.nio.file.AccessDeniedException;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ProjectService {
 private final ProjectRepository projectRepository;
 private final WorkSpaceRepository workSpaceRepository;
 private final WorkspaceMemberRepository workspaceMemberRepository;
 public ProjectService(ProjectRepository projectRepository, WorkSpaceRepository workSpaceRepository,WorkspaceMemberRepository workspaceMemberRepository){
     this.projectRepository=projectRepository;
     this.workSpaceRepository = workSpaceRepository;
     this.workspaceMemberRepository = workspaceMemberRepository;
 }

 public List<ProjectResponse> getAllProjectsbyWorkspaceId(Long workspaceId){
     return projectRepository.findByWorkspaceId(workspaceId)
             .stream()
             .map(project -> new ProjectResponse(
                     project.getId(),
                     project.getName(),
                     project.getDescription(),
                     project.getStatus(),
                     project.getWorkspace().getId(),
                     project.getCreatedBy().getEmail(),
                     project.getCreatedAt()
             ))
             .toList();
 }
    public ProjectResponse getProjectById(Long id) {
        Project project =  projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        return new ProjectResponse(
                project.getId(),
                project.getName(),
                project.getDescription(),
                project.getStatus(),
                project.getWorkspace().getId(),
                project.getCreatedBy().getEmail(),
                project.getCreatedAt()
        );
    }
    public ProjectResponse createProject(ProjectRequest request, Long currentWorkspaceId, User currentUser)
            throws AccessDeniedException {

        Workspace workspace = workSpaceRepository.findById(currentWorkspaceId)
                .orElseThrow(() -> new RuntimeException("Workspace not found"));

        if (currentUser.getRole().equals(Roles.PROJECT_MANAGER)) {

            boolean belongsToWorkspace = workspaceMemberRepository
                    .existsByWorkspaceIdAndUserId(currentWorkspaceId, currentUser.getId());

            if (!belongsToWorkspace) {
                throw new AccessDeniedException("You are not allowed to manage this workspace");
            }

        } else if (!currentUser.getRole().equals(Roles.ADMIN)) {
            throw new AccessDeniedException("Only admin or project manager can create projects");
        }

        Project project = new Project();
        project.setName(request.getName());
        project.setDescription(request.getDescription());
        project.setStatus(request.getStatus());
        project.setWorkspace(workspace);
        project.setCreatedAt(LocalDateTime.now());
        project.setCreatedBy(currentUser);

        Project saved = projectRepository.save(project);

        return new ProjectResponse(
                saved.getId(),
                saved.getName(),
                saved.getDescription(),
                saved.getStatus(),
                saved.getWorkspace().getId(),
                saved.getCreatedBy().getEmail(),
                saved.getCreatedAt()
        );
    }
public ProjectResponse updateProject(ProjectRequest request,Long projectId, User currentUser) throws AccessDeniedException {
     Project project = projectRepository.findById(projectId)
             .orElseThrow(()->new RuntimeException("Project not found"));
    if (currentUser.getRole().equals(Roles.PROJECT_MANAGER)) {

        boolean isProjectCreator = projectRepository
                .existsByIdAndCreatedById(project.getId(),currentUser.getId());
      System.out.println(isProjectCreator);
        if (!isProjectCreator) {
            throw new AccessDeniedException("You are not allowed to manage this project");
        }

    }
    else if (!currentUser.getRole().equals(Roles.ADMIN)) {
        throw new AccessDeniedException("Only admin or creator of this project can update projects");
    }
         project.setName(request.getName());
         project.setDescription(request.getDescription());
         project.setStatus(request.getStatus());
         Project update = projectRepository.save(project);
         return new ProjectResponse(
                 update.getId(),
                 update.getName(),
                 update.getDescription(),
                 update.getStatus(),
                 update.getWorkspace().getId(),
                 update.getCreatedBy().getEmail(),
                 update.getCreatedAt()
         );
 }
    public ProjectResponse updateProjectStatus(
            ProjectStatusPatch request,
            Long projectId,
            User currentUser
    ) throws AccessDeniedException {

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        if (currentUser.getRole().equals(Roles.PROJECT_MANAGER)) {

            boolean isProjectCreator = projectRepository
                    .existsByIdAndCreatedById(project.getId(),currentUser.getId());

            if (!isProjectCreator) {
                throw new AccessDeniedException("You are not allowed to manage this project");
            }

        } else if (!currentUser.getRole().equals(Roles.ADMIN)) {
            throw new AccessDeniedException("Only admin or creator of this project can update status of the projects");
        }
        project.setStatus(request.getProjectStatus());

        Project patched = projectRepository.save(project);

        return new ProjectResponse(
                patched.getId(),
                patched.getName(),
                patched.getDescription(),
                patched.getStatus(),
                patched.getWorkspace().getId(),
                patched.getCreatedBy().getEmail(),
                patched.getCreatedAt()
        );
    }
    public String deleteProject(Long projectId,User currentUser) throws AccessDeniedException {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        if (currentUser.getRole().equals(Roles.PROJECT_MANAGER)) {

            boolean isProjectCreator = projectRepository
                    .existsByIdAndCreatedById(project.getId(),currentUser.getId());

            if (!isProjectCreator) {
                throw new AccessDeniedException("You are not allowed to delete this project");
            }

        } else if (!currentUser.getRole().equals(Roles.ADMIN)) {
            throw new AccessDeniedException("Only admin or creator of this project can delete the projects");
        }
        projectRepository.delete(project);
        return "Project deleted successfully";
    }
}
