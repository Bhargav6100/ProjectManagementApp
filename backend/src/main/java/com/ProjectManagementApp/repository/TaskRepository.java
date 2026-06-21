package com.ProjectManagementApp.repository;

import com.ProjectManagementApp.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskRepository extends JpaRepository<Task,Long> {
}
