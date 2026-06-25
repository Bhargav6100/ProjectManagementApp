package com.ProjectManagementApp.service;

import com.ProjectManagementApp.dto.WorkspaceMemberResponse;
import com.ProjectManagementApp.entity.User;
import com.ProjectManagementApp.entity.Workspace;
import com.ProjectManagementApp.entity.WorkspaceMember;
import com.ProjectManagementApp.repository.UserRepository;
import com.ProjectManagementApp.repository.WorkSpaceRepository;
import com.ProjectManagementApp.repository.WorkspaceMemberRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
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
                .orElseThrow(() -> new RuntimeException("Workspace not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        boolean alreadyMember = workspaceMemberRepository
                .existsByWorkspaceIdAndUserId(workspaceId, userId);

        if (alreadyMember) {
            throw new RuntimeException("User is already a member of this workspace");
        }

        WorkspaceMember member = new WorkspaceMember();
        member.setWorkspace(workspace);
        member.setUser(user);
        member.setJoinedAt(LocalDateTime.now());

        WorkspaceMember saved = workspaceMemberRepository.save(member);

        return new WorkspaceMemberResponse(
              saved.getId(),
                saved.getWorkspace().getName(),
                saved.getUser().getFirstName() + " " + saved.getUser().getLastName(),
                saved.getJoinedAt(),
                saved.getWorkspace().getId(),
                saved.getUser().getEmail(),
                saved.getUser().getRole()
        );
    }
}
