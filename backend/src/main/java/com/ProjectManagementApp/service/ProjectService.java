package com.ProjectManagementApp.service;

import com.ProjectManagementApp.dto.ProjectRequest;
import com.ProjectManagementApp.dto.ProjectResponse;
import com.ProjectManagementApp.entity.Project;
import com.ProjectManagementApp.entity.User;
import com.ProjectManagementApp.entity.Workspace;
import com.ProjectManagementApp.repository.ProjectRepository;
import com.ProjectManagementApp.repository.WorkSpaceRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class ProjectService {
 private final ProjectRepository projectRepository;
 private final WorkSpaceRepository workSpaceRepository;
 public ProjectService(ProjectRepository projectRepository, WorkSpaceRepository workSpaceRepository){
     this.projectRepository=projectRepository;
     this.workSpaceRepository = workSpaceRepository;
 }
 public ProjectResponse createProject(ProjectRequest request, Long currentWorkspaceId,User currentUser){

     Workspace workspace = workSpaceRepository.findById(currentWorkspaceId)
             .orElseThrow(() -> new RuntimeException("Workspace not found"));
     Project project = new Project();
      project.setName(request.getName());
      project.setDescription(request.getDescription());
      project.setStatus(request.getStatus());
      project.setWorkSpace(workspace);
      project.setCreatedAt(LocalDateTime.now());
      project.setCreatedBy(currentUser);
      Project saved = projectRepository.save(project);

      return new ProjectResponse(
              saved.getId(),
              saved.getName(),
              saved.getDescription(),
              saved.getStatus(),
              saved.getWorkSpace().getId(),
              saved.getCreatedBy().getEmail(),
              saved.getCreatedAt()
      );

 }
}
