package com.ProjectManagementApp.service;

import com.ProjectManagementApp.dto.UserResponse;
import com.ProjectManagementApp.dto.WorkspaceMemberResponse;
import com.ProjectManagementApp.entity.User;
import com.ProjectManagementApp.entity.Workspace;
import com.ProjectManagementApp.entity.WorkspaceMember;
import com.ProjectManagementApp.exception.DuplicateResourceException;
import com.ProjectManagementApp.exception.ResourceNotFoundException;
import com.ProjectManagementApp.repository.UserRepository;
import com.ProjectManagementApp.repository.WorkSpaceRepository;
import com.ProjectManagementApp.repository.WorkspaceMemberRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class WorkspaceMemberService {
  private final WorkSpaceRepository workSpaceRepository;
  private final UserRepository userRepository;
  private final WorkspaceMemberRepository workspaceMemberRepository;
    public WorkspaceMemberService(WorkSpaceRepository workSpaceRepository, UserRepository userRepository, WorkspaceMemberRepository workspaceMemberRepository) {
        this.workSpaceRepository = workSpaceRepository;
        this.userRepository = userRepository;
        this.workspaceMemberRepository = workspaceMemberRepository;
    }
    public WorkspaceMemberResponse addMember(Long workspaceId, Long userId) {

        Workspace workspace = workSpaceRepository.findById(workspaceId)
                .orElseThrow(() -> new ResourceNotFoundException("Workspace not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        boolean alreadyMember = workspaceMemberRepository
                .existsByWorkspaceIdAndUserId(workspaceId, userId);

        if (alreadyMember) {
            throw new DuplicateResourceException("User is already a member of this workspace");
        }

        WorkspaceMember member = new WorkspaceMember();
        member.setWorkspace(workspace);
        member.setUser(user);
        member.setJoinedAt(LocalDateTime.now());

        WorkspaceMember saved = workspaceMemberRepository.save(member);

        return new WorkspaceMemberResponse(
              saved.getId(),
                saved.getWorkspace().getName(),
                saved.getUser().getFirstName(),
                saved.getUser().getLastName(),
                saved.getJoinedAt(),
                saved.getWorkspace().getId(),
                saved.getUser().getEmail(),
                saved.getUser().getRole()
        );
    }
    public List<UserResponse> getWorkspaceMembers(Long workspaceId) {

        return workspaceMemberRepository.findByWorkspaceId(workspaceId)
                .stream()
                .map(WorkspaceMember::getUser)
                .map(user -> new UserResponse(
                        user.getId(),
                        user.getFirstName(),
                        user.getLastName(),
                        user.getEmail(),
                        user.getRole(),
                        user.getCreatedAt(),
                        user.isActive()
                ))
                .toList();
    }
}
