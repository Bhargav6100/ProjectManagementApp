package com.ProjectManagementApp.repository;

import com.ProjectManagementApp.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task,Long> {
    List<Task> findByProjectId(Long projectId);
}
