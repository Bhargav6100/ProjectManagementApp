package com.ProjectManagementApp.dto;

import com.ProjectManagementApp.entity.Project;
import com.ProjectManagementApp.entity.ProjectStatus;

import java.time.LocalDateTime;

public class ProjectResponse {
    private Long id;
    private String name;
    private String description;
    private ProjectStatus status;
    private long workspaceId;
    private String createdBy;
    private LocalDateTime createdAt;

    public ProjectResponse(String name, String description,ProjectStatus status, long workspaceId, String createdBy, LocalDateTime createdAt) {
        this.name = name;
        this.description = description;
        this.status = status;
        this.workspaceId = workspaceId;
        this.createdBy = createdBy;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public ProjectStatus getStatus() {
        return status;
    }

    public void setStatus(ProjectStatus status) {
        this.status = status;
    }

    public long getWorkspaceId() {
        return workspaceId;
    }

    public void setWorkspaceId(long workspaceId) {
        this.workspaceId = workspaceId;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
