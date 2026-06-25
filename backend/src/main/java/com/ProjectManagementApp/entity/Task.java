package com.ProjectManagementApp.entity;

import jakarta.persistence.*;
import org.springframework.cglib.core.Local;

import java.time.LocalDate;
import java.time.LocalDateTime;

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

    @Column(name = "createdAt", nullable = false, length = 100)
    private LocalDateTime createdAt;
    @ManyToOne
    @JoinColumn(name = "assignedToUserId", nullable = false)
    private User assignedTo;
    @ManyToOne
    @JoinColumn(name = "assignedBy", nullable = false)
    private User assignedBy;

    @Column(name = "dueDate", nullable = false)
    private LocalDate dueDate;
    @Enumerated(EnumType.STRING)
    @Column(name = "taskStatus", nullable = false, length = 100)
    public TaskStatus taskStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "taskPriority", nullable = false, length = 100)
    public TaskPriority taskPriority;

public Task(){

}

    public Task(String title, String description, Project project, LocalDateTime createdAt, User assignedTo, User assignedBy, LocalDate dueDate, TaskStatus taskStatus, TaskPriority taskPriority) {
        this.title = title;
        this.description = description;
        this.project = project;
        this.createdAt=createdAt;
        this.assignedTo = assignedTo;
        this.assignedBy = assignedBy;
        this.dueDate = dueDate;
        this.taskStatus = taskStatus;
        this.taskPriority = taskPriority;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Project getProject() {
        return project;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
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
                "id=" + id +
                ", title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", project=" + project +
                ", createdAt=" + createdAt +
                ", assignedToUserId=" + assignedTo +
                ", assignedBy=" + assignedBy +
                ", dueDate=" + dueDate +
                ", taskStatus=" + taskStatus +
                ", taskPriority=" + taskPriority +
                '}';
    }
}
