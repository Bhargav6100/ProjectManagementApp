package com.ProjectManagementApp.dto;

import com.ProjectManagementApp.entity.Project;
import com.ProjectManagementApp.entity.ProjectStatus;

public class ProjectRequest {
    private String name;
    private String description;
    private ProjectStatus status;

    public ProjectRequest(String name, String description, ProjectStatus status) {
        this.name = name;
        this.description = description;
        this.status = status;
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
}
