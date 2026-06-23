package com.ProjectManagementApp.service;

import com.ProjectManagementApp.dto.WorkspaceRequest;
import com.ProjectManagementApp.dto.WorkspaceResponse;
import com.ProjectManagementApp.entity.User;
import com.ProjectManagementApp.entity.Workspace;
import com.ProjectManagementApp.repository.WorkSpaceRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class WorkspaceService {

    private final WorkSpaceRepository workSpaceRepository;

   public WorkspaceService(WorkSpaceRepository workSpaceRepository){
       this.workSpaceRepository=workSpaceRepository;
   }
   public WorkspaceResponse createWorkspace(WorkspaceRequest request, User currentUser){
       Workspace workspace = new Workspace();
       workspace.setName(request.getName());
       workspace.setDescription(request.getDescription());
       workspace.setCreatedBy(currentUser);
       workspace.setCreatedAt(LocalDateTime.now());
       Workspace saved = workSpaceRepository.save(workspace);

       return new WorkspaceResponse(
               saved.getId(),
               saved.getName(),
               saved.getDescription(),
               saved.getCreatedAt(),
               saved.getCreatedBy().getEmail());
   }
}
