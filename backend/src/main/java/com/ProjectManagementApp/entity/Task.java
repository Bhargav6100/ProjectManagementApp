package com.ProjectManagementApp.entity;

import jakarta.persistence.*;

@Entity
@Table(name="task")
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "title", nullable = false, length = 100)
    private String title;
    @Column(name = "description", nullable = false, length = 100)
    private String description;
    @ManyToOne
    @JoinColumn(name = "project", nullable = false)
    private Project project;
    @ManyToOne
    @JoinColumn(name = "assignedTo", nullable = false)
    private User assignedTo;
    @ManyToOne
    @JoinColumn(name = "assignedBy", nullable = false)
    private User assignedBy;
    @Enumerated(EnumType.STRING)
    @Column(name = "taskStatus", nullable = false, length = 100)
    public TaskStatus taskStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "taskPriority", nullable = false, length = 100)
    public TaskPriority taskPriority;

public Task(){

}

    public Task(String title, String description, Project project, User assignedTo, User assignedBy, TaskStatus taskStatus, TaskPriority taskPriority) {
        this.title = title;
        this.description = description;
        this.project = project;
        this.assignedTo = assignedTo;
        this.assignedBy = assignedBy;
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

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public User getAssignedTo() {
        return assignedTo;
    }

    public void setAssignedTo(User assignedTo) {
        this.assignedTo = assignedTo;
    }

    public User getAssignedBy() {
        return assignedBy;
    }

    public void setAssignedBy(User assignedBy) {
        this.assignedBy = assignedBy;
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

    @Override
    public String toString() {
        return "Task{" +
                "title='" + title + '\'' +
                ", id=" + id +
                ", description='" + description + '\'' +
                ", project=" + project +
                ", assignedTo=" + assignedTo +
                ", assignedBy=" + assignedBy +
                ", taskStatus=" + taskStatus +
                ", taskPriority=" + taskPriority +
                '}';
    }
}
