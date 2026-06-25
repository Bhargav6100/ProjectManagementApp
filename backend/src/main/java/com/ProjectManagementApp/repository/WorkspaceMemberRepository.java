package com.ProjectManagementApp.repository;

import com.ProjectManagementApp.entity.WorkspaceMember;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WorkspaceMemberRepository extends JpaRepository<WorkspaceMember,Long> {
    boolean existsByWorkspaceIdAndUserId(Long workspaceId, Long userId);
}
