package com.ProjectManagementApp.service;

import com.ProjectManagementApp.entity.WorkspaceMember;
import com.ProjectManagementApp.dto.WorkspaceRequest;
import com.ProjectManagementApp.dto.WorkspaceResponse;
import com.ProjectManagementApp.entity.Roles;
import com.ProjectManagementApp.entity.User;
import com.ProjectManagementApp.entity.Workspace;
import com.ProjectManagementApp.exception.ResourceNotFoundException;
import com.ProjectManagementApp.repository.WorkSpaceRepository;
import com.ProjectManagementApp.repository.WorkspaceMemberRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;


@Service
public class WorkspaceService {

    private final WorkSpaceRepository workSpaceRepository;

    private final WorkspaceMemberRepository workspaceMemberRepository;


    public WorkspaceService(WorkSpaceRepository workSpaceRepository, WorkspaceMemberRepository workspaceMemberRepository) {
        this.workSpaceRepository = workSpaceRepository;
        this.workspaceMemberRepository = workspaceMemberRepository;
    }

    public List<WorkspaceResponse> getAllWorkspace(User currentUser) throws AccessDeniedException {
        if (!currentUser.getRole().equals(Roles.ADMIN)) {
            throw new AccessDeniedException("You are not allowed to view workspaces");
        }
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

    public List<WorkspaceResponse> getMyWorkspaces(User currentUser) {

        return workspaceMemberRepository.findByUserId(currentUser.getId())
                .stream()
                .map(WorkspaceMember::getWorkspace)
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
    public WorkspaceResponse getWorkspaceById(Long workspaceId, User currentUser)
            throws AccessDeniedException {

        if (!currentUser.getRole().equals(Roles.ADMIN)) {

            boolean isMember = workspaceMemberRepository
                    .existsByWorkspaceIdAndUserId(workspaceId, currentUser.getId());

            if (!isMember) {
                throw new AccessDeniedException(
                        "You are not a member of this workspace"
                );
            }
        }

        Workspace workspace = workSpaceRepository.findById(workspaceId)
                .orElseThrow(() -> new ResourceNotFoundException("Workspace not found"));

        return new WorkspaceResponse(
                workspace.getId(),
                workspace.getName(),
                workspace.getDescription(),
                workspace.getCreatedAt(),
                workspace.getCreatedBy().getEmail()
        );
    }

    public WorkspaceResponse createWorkspace(WorkspaceRequest request, User currentUser) throws AccessDeniedException {

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

    public WorkspaceResponse updateWorkspace(WorkspaceRequest request, Long currentWorkspaceId, User currentUser) throws AccessDeniedException {
        Workspace workspace = workSpaceRepository.findById(currentWorkspaceId)
                .orElseThrow(() -> new ResourceNotFoundException("Workspace not found"));
      if (!currentUser.getRole().equals(Roles.ADMIN)) {
            throw new AccessDeniedException("Only admin can update workspaces");
        }
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
    @Transactional
    public String deleteWorkspace(Long currentWorkspaceId, User currentUser) throws AccessDeniedException {
        Workspace workspace = workSpaceRepository.findById(currentWorkspaceId)
                .orElseThrow(() -> new ResourceNotFoundException("Workspace not found"));

        if (!currentUser.getRole().equals(Roles.ADMIN)) {
            throw new AccessDeniedException("Only admin can delete workspaces");
        }
        workspaceMemberRepository.deleteByWorkspaceId(currentWorkspaceId);
        workSpaceRepository.delete(workspace);
        return "Workspace deleted successfully";
    }
}
