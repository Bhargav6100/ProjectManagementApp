package com.ProjectManagementApp.dto;

import com.ProjectManagementApp.entity.TaskPriority;

public class TaskPriorityPatch {
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
