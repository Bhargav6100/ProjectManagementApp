package com.ProjectManagementApp.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class WorkspaceMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Workspace workspace;

    @ManyToOne
    private User user;

    private LocalDateTime joinedAt;



    public WorkspaceMember(){

    }

    public WorkspaceMember(Long id, Workspace workspace, User user, LocalDateTime joinedAt) {
        this.id = id;
        this.workspace = workspace;
        this.user = user;
        this.joinedAt = joinedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Workspace getWorkspace() {
        return workspace;
    }

    public void setWorkspace(Workspace workspace) {
        this.workspace = workspace;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public LocalDateTime getJoinedAt() {
        return joinedAt;
    }

    public void setJoinedAt(LocalDateTime joinedAt) {
        this.joinedAt = joinedAt;
    }
}
