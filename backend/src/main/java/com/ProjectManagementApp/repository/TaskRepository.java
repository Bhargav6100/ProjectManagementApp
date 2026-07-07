package com.ProjectManagementApp.repository;

import com.ProjectManagementApp.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task,Long> {
    List<Task> findByProjectId(Long projectId);
    List<Task> findByAssignedToId(Long userId);

    List<Task> findByAssignedById(Long userId);
    boolean existsByIdAndAssignedById(Long taskId, Long userId);
    boolean existsByIdAndAssignedToId(Long taskId, Long userId);

    void deleteByProjectId(Long projectId);
}
