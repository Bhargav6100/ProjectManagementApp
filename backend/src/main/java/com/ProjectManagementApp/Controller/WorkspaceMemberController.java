package com.ProjectManagementApp.Controller;

import com.ProjectManagementApp.dto.WorkspaceMemberResponse;
import com.ProjectManagementApp.service.WorkspaceMemberService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
