package com.ProjectManagementApp.dto;

import com.ProjectManagementApp.entity.TaskStatus;
import jakarta.validation.constraints.NotNull;

public class TaskStatusPatch {
    @NotNull(message = "Task status is required")
    private TaskStatus taskStatus;

public TaskStatusPatch(){

}
 public TaskStatusPatch(TaskStatus taskStatus) {
        this.taskStatus = taskStatus;
    }

    public TaskStatus getTaskStatus() {
        return taskStatus;
    }

    public void setTaskStatus(TaskStatus taskStatus) {
        this.taskStatus = taskStatus;
    }
}
