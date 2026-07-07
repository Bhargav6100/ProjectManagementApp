package com.ProjectManagementApp.Controller;

import com.ProjectManagementApp.dto.UserResponse;
import com.ProjectManagementApp.dto.WorkspaceMemberResponse;
import com.ProjectManagementApp.service.WorkspaceMemberService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class WorkspaceMemberController {

    private final WorkspaceMemberService workspaceMemberService;

    public WorkspaceMemberController(WorkspaceMemberService workspaceMemberService) {
        this.workspaceMemberService = workspaceMemberService;
    }

    @PostMapping("/api/workspaces/{workspaceId}/members/{userId}")
    public ResponseEntity<WorkspaceMemberResponse> addMember(
            @PathVariable Long workspaceId,
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                workspaceMemberService.addMember(workspaceId, userId)
        );
    }
    @GetMapping("/api/workspaces/{workspaceId}/members")
    public ResponseEntity<List<UserResponse>> getWorkspaceMembers(
            @PathVariable Long workspaceId
    ) {
        List<UserResponse> members = workspaceMemberService.getWorkspaceMembers(workspaceId);

        return ResponseEntity.ok(members);
    }
    @DeleteMapping("/api/workspaces/{workspaceId}/members/{userId}")
    public ResponseEntity<String> removeMember(
            @PathVariable Long workspaceId,
            @PathVariable Long userId
    ) {
        workspaceMemberService.removeMember(workspaceId, userId);

        return ResponseEntity.ok("User removed from workspace successfully");
    }
}
