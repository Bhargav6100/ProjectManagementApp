package com.ProjectManagementApp.dto;
import com.ProjectManagementApp.entity.TaskPriority;
import com.ProjectManagementApp.entity.TaskStatus;
import jakarta.validation.constraints.*;

import java.time.LocalDate;

public class TaskRequest {
    @NotBlank(message = "Task title is required")
    @Size(max = 100, message = "Task title cannot exceed 100 characters")
    private String title;
    @NotBlank(message = "Task description is required")
    private String description;
    @NotNull(message="Dates cannot be null")
    @FutureOrPresent
    private LocalDate dueDate;
    @NotNull(message="userid cannot be null")
    @Positive
    private long assignedToUserId;
    @NotNull(message="task status cannot be null")
    private TaskStatus taskStatus;
    @NotNull(message="task priority cannot be null")
    private TaskPriority taskPriority;
    public TaskRequest(String title, String description, LocalDate dueDate, long assignedToUserId, TaskStatus taskStatus, TaskPriority taskPriority) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.assignedToUserId = assignedToUserId;
        this.taskStatus = taskStatus;
        this.taskPriority = taskPriority;
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
}
