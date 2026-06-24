package com.ProjectManagementApp.dto;

import com.ProjectManagementApp.entity.TaskPriority;
import com.ProjectManagementApp.entity.TaskStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class TaskResponse {
    private long id;
    private String title;
    private String description;
    private LocalDate dueDate;
    private long assignedToUserId;
    private TaskStatus taskStatus;
    private long projectId;
    private TaskPriority taskPriority;
    private LocalDateTime createdAt;
    private String createdBy;

    public TaskResponse(long id, String title, String description, LocalDate dueDate, long assignedToUserId, TaskStatus taskStatus, TaskPriority taskPriority, LocalDateTime createdAt, String createdBy,long projectId) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.assignedToUserId = assignedToUserId;
        this.taskStatus = taskStatus;
        this.taskPriority = taskPriority;
        this.createdAt = createdAt;
        this.createdBy = createdBy;
        this.projectId = projectId;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public long getAssignedToUserId() {
        return assignedToUserId;
    }

    public void setAssignedToUserId(long assignedToUserId) {
        this.assignedToUserId = assignedToUserId;
    }

    public TaskStatus getTaskStatus() {
        return taskStatus;
    }

    public void setTaskStatus(TaskStatus taskStatus) {
        this.taskStatus = taskStatus;
    }

    public TaskPriority getTaskPriority() {
        return taskPriority;
    }

    public void setTaskPriority(TaskPriority taskPriority) {
        this.taskPriority = taskPriority;
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

    public long getProjectId() {
        return projectId;
    }

    public void setProject(long projectId) {
        this.projectId = projectId;
    }
}
