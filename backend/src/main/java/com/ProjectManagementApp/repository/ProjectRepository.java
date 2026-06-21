package com.ProjectManagementApp.repository;

import com.ProjectManagementApp.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectRepository extends JpaRepository<Project,Long> {
}
