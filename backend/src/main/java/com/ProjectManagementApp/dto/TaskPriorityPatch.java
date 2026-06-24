package com.ProjectManagementApp.dto;

import com.ProjectManagementApp.entity.TaskPriority;
import jakarta.validation.constraints.NotNull;

public class TaskPriorityPatch {
    @NotNull(message = "Task priority is required")
    private TaskPriority taskPriority;

    public TaskPriorityPatch(TaskPriority taskPriority) {
        this.taskPriority = taskPriority;
    }

    public TaskPriority getTaskPriority() {
        return taskPriority;
    }

    public void setTaskPriority(TaskPriority taskPriority) {
        this.taskPriority = taskPriority;
    }
}
