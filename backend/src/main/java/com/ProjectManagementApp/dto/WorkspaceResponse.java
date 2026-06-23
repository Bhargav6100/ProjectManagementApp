package com.ProjectManagementApp.dto;

import java.time.LocalDateTime;

public class WorkspaceResponse {
 private long id;
 private String name;
 private String description;
 private LocalDateTime createdAt;
 private String createdBy;

    public WorkspaceResponse(String name, String description, LocalDateTime createdAt, String createdBy) {
        this.name = name;
        this.description = description;
        this.createdAt = createdAt;
        this.createdBy = createdBy;
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }
}

