package com.ProjectManagementApp.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;
@Entity
@Table(name="project")
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @ManyToOne
    @JoinColumn(name = "workspace", nullable = false)
    private Workspace workspace;
    @Column(name = "name", nullable = false, length = 100)
    private String name;
    @Column(name = "createdAt", nullable = false, length = 100)
    private LocalDateTime createdAt;
    @Column(name = "description", nullable = false, length = 100)
    private String description;
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 100)
    private ProjectStatus status;
    @ManyToOne
    @JoinColumn(name = "createdBy", nullable = false)
    private User createdBy;

    public Project(){

    }
    public Project(Workspace workspace, String name, LocalDateTime createdAt, String description, ProjectStatus status,User createdBy) {
        this.workspace = workspace;
        this.name = name;
        this.createdAt = createdAt;
        this.description = description;
        this.status = status;
        this.createdBy = createdBy;
    }

    public Workspace getWorkspace() {
        return workspace;
    }

    public void setWorkspace(Workspace workSpace) {
        this.workspace = workSpace;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
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
                "workSpace=" + workspace +
                ", name='" + name + '\'' +
                ", id=" + id +
                ", createdAt=" + createdAt +
                ", description='" + description + '\'' +
                ", status=" + status +
                ", createdBy=" + createdBy +
                '}';
    }
}
