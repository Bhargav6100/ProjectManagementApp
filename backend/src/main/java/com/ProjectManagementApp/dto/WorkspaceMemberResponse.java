package com.ProjectManagementApp.dto;

import com.ProjectManagementApp.entity.Roles;
import com.ProjectManagementApp.entity.User;
import com.ProjectManagementApp.entity.Workspace;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class WorkspaceMemberResponse {

    private long id;
    private String workspaceName;
    private String userName;
    private LocalDateTime joinedAt;
    private long workspaceId;
    private String email;
    private Roles role;

    public WorkspaceMemberResponse(){

    }

    public WorkspaceMemberResponse(long id, String workspaceName,String userName, LocalDateTime joinedAt, long workspaceId, String email, Roles role) {
        this.id = id;
        this.workspaceName = workspaceName;
        this.userName = userName;
        this.joinedAt = joinedAt;
        this.workspaceId = workspaceId;
        this.email = email;
        this.role = role;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getWorkspace() {
        return workspaceName;
    }

    public void setWorkspace(String workspaceName) {
        this.workspaceName = workspaceName;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public LocalDateTime getJoinedAt() {
        return joinedAt;
    }

    public void setJoinedAt(LocalDateTime joinedAt) {
        this.joinedAt = joinedAt;
    }

    public long getWorkspaceId() {
        return workspaceId;
    }

    public void setWorkspaceId(long workspaceId) {
        this.workspaceId = workspaceId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Roles getRole() {
        return role;
    }

    public void setRole(Roles role) {
        this.role = role;
    }
}
