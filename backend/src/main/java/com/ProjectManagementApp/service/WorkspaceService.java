package com.ProjectManagementApp.service;

import com.ProjectManagementApp.dto.WorkspaceRequest;
import com.ProjectManagementApp.dto.WorkspaceResponse;
import com.ProjectManagementApp.entity.User;
import com.ProjectManagementApp.entity.Workspace;
import com.ProjectManagementApp.repository.WorkSpaceRepository;
import org.springframework.stereotype.Service;
import java.util.Optional;
import java.time.LocalDateTime;
import java.util.List;


@Service
public class WorkspaceService {

    private final WorkSpaceRepository workSpaceRepository;

    public WorkspaceService(WorkSpaceRepository workSpaceRepository){
        this.workSpaceRepository=workSpaceRepository;
    }


    public List<WorkspaceResponse> getAllWorkspace() {
        return workSpaceRepository.findAll()
                .stream()
                .map(workspace -> new WorkspaceResponse(
                        workspace.getId(),
                        workspace.getName(),
                        workspace.getDescription(),
                        workspace.getCreatedAt(),
                        workspace.getCreatedBy().getEmail()
                ))
        .toList();
    }

    // Get a specific record by its ID
    public WorkspaceResponse getWorkspaceById(Long id) {

        Workspace workspace= workSpaceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Workspace not found"));
        return new WorkspaceResponse(
                workspace.getId(),
                workspace.getName(),
                workspace.getDescription(),
                workspace.getCreatedAt(),
                workspace.getCreatedBy().getEmail()
        );
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
   public WorkspaceResponse updateWorkspace(WorkspaceRequest request,Long workspaceId){
       Workspace workspace = workSpaceRepository.findById(workspaceId)
               .orElseThrow(() -> new RuntimeException("Workspace not found"));
        workspace.setName(request.getName());
        workspace.setDescription(request.getDescription());
        Workspace updated = workSpaceRepository.save(workspace);
       return new WorkspaceResponse(
               updated.getId(),
               updated.getName(),
               updated.getDescription(),
               updated.getCreatedAt(),
               updated.getCreatedBy().getEmail()
       );
    }
}
