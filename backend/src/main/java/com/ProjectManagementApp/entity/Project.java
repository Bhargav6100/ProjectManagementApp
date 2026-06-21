package com.ProjectManagementApp.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;
@Entity
@Table(name="project")
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "workspace", nullable = false)
    private Workspace workSpace;
    @Column(name = "name", nullable = false, length = 100)
    private String name;
    @Column(name = "createdAt", nullable = false, length = 100)
    private LocalDateTime createdAt;
    @Column(name = "description", nullable = false, length = 100)
    private String description;
    private enum ProjectStatus{ COMPLETE,ACTIVE,ARCHIVED}
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 100)
    private ProjectStatus status;
    @ManyToOne
    @JoinColumn(name = "createdBy", nullable = false)
    private User createdBy;
    public Project(Workspace workSpace, String name, LocalDateTime createdAt, String description, ProjectStatus status,User createdBy) {
        this.workSpace = workSpace;
        this.name = name;
        this.createdAt = createdAt;
        this.description = description;
        this.status = status;
        this.createdBy = createdBy;
    }

    public Workspace getWorkSpace() {
        return workSpace;
    }

    public void setWorkSpace(Workspace workSpace) {
        this.workSpace = workSpace;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
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

    public User getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(User createdBy) {
        this.createdBy = createdBy;
    }

    @Override
    public String toString() {
        return "Project{" +
                "workSpace=" + workSpace +
                ", name='" + name + '\'' +
                ", id=" + id +
                ", createdAt=" + createdAt +
                ", description='" + description + '\'' +
                ", status=" + status +
                ", createdBy=" + createdBy +
                '}';
    }
}
