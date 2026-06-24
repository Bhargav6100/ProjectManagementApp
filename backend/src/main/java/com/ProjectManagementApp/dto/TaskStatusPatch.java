package com.ProjectManagementApp.dto;

import com.ProjectManagementApp.entity.TaskStatus;

public class TaskStatusPatch {
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
