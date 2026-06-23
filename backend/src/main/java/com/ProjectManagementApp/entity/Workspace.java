package com.ProjectManagementApp.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name="workspace")
public class Workspace {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @Column(name = "name", nullable = false, length = 100)
    private String name;
    @Column(name = "createdAt", nullable = false, length = 100)
    private LocalDateTime createdAt;
    @Column(name = "description", nullable = false, length = 100)
    private String description;
    @ManyToOne
    @JoinColumn(name = "createdBy", nullable = false)
    private User createdBy;

 public Workspace(){

 }

    public Workspace(String name, LocalDateTime createdAt, String description, User createdBy) {
        this.name = name;
        this.createdAt = createdAt;
        this.description = description;
        this.createdBy = createdBy;
    }

    public long getId(){return id;}

    public void setId(long id){this.id = id;}
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

    public User getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(User createdBy) {
        this.createdBy = createdBy;
    }

    @Override
    public String toString() {
        return "Workspace{" +
                "name='" + name + '\'' +
                ", id=" + id +
                ", createdAt=" + createdAt +
                ", description='" + description + '\'' +
                ", owner='" + createdBy + '\'' +
                '}';
    }
}
