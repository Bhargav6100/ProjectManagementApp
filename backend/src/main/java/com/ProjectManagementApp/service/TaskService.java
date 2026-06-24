package com.ProjectManagementApp.service;

import com.ProjectManagementApp.dto.*;
import com.ProjectManagementApp.entity.Project;
import com.ProjectManagementApp.entity.Task;
import com.ProjectManagementApp.entity.User;
import com.ProjectManagementApp.repository.ProjectRepository;
import com.ProjectManagementApp.repository.TaskRepository;
import com.ProjectManagementApp.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public TaskService(TaskRepository taskRepository, ProjectRepository projectRepository, UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
    }
    public TaskResponse getTasksByTaskId(Long taskId){
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task with that Id not found"));
        return new TaskResponse(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getDueDate(),
                task.getAssignedToUserId().getId(),
                task.getTaskStatus(),
                task.getTaskPriority(),
                task.getCreatedAt(),
                task.getAssignedBy().getEmail(),
                task.getProject().getId()
        );
    }
    public List<TaskResponse> getTaskByProjectId(Long projectId){
        return taskRepository.findByProjectId(projectId)
                .stream()
                .map(task -> new TaskResponse(
                        task.getId(),
                        task.getTitle(),
                        task.getDescription(),
                        task.getDueDate(),
                        task.getAssignedToUserId().getId(),
                        task.getTaskStatus(),
                        task.getTaskPriority(),
                        task.getCreatedAt(),
                        task.getAssignedBy().getEmail(),
                        task.getProject().getId()
                ))
                .toList();
    }

    public TaskResponse createTask(TaskRequest request, Long projectId, User currentUser){
        Project project = projectRepository.findById(projectId).orElseThrow(() -> new RuntimeException("Project not found"));
        User assignedTo = userRepository.findById(request.getAssignedToUserId())
                .orElseThrow();

        Task task = new Task();
           task.setTitle(request.getTitle());
           task.setDescription(request.getDescription());
           task.setDueDate(request.getDueDate());
           task.setProject(project);
           task.setAssignedToUserId(assignedTo);
           task.setTaskStatus(request.getTaskStatus());
           task.setTaskPriority(request.getTaskPriority());
           task.setAssignedBy(currentUser);
           task.setCreatedAt(LocalDateTime.now());

           Task saved = taskRepository.save(task);

           return new TaskResponse(
                   saved.getId(),
                   saved.getTitle(),
                   saved.getDescription(),
                   saved.getDueDate(),
                   saved.getAssignedToUserId().getId(),
                   saved.getTaskStatus(),
                   saved.getTaskPriority(),
                   saved.getCreatedAt(),
                   saved.getAssignedBy().getEmail(),
                   saved.getProject().getId()
           );
    }
    public TaskResponse updateTask(TaskRequest request, Long taskId){
        Task task = taskRepository.findById(taskId)
                .orElseThrow(()->new RuntimeException("Task not found"));
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setTaskStatus(request.getTaskStatus());
        task.setTaskPriority(request.getTaskPriority());
        Task update = taskRepository.save(task);
        return new TaskResponse(
                update.getId(),
                update.getTitle(),
                update.getDescription(),
                update.getDueDate(),
                update.getAssignedToUserId().getId(),
                update.getTaskStatus(),
                update.getTaskPriority(),
                update.getCreatedAt(),
                update.getAssignedBy().getEmail(),
                update.getProject().getId()
        );
    }
    public TaskResponse updateTaskStatus(TaskStatusPatch request, Long taskId){
        Task task = taskRepository.findById(taskId)
                .orElseThrow(()->new RuntimeException("Task not found"));
        task.setTaskStatus(request.getTaskStatus());
        Task patched = taskRepository.save(task);
        return new TaskResponse(
                patched.getId(),
                patched.getTitle(),
                patched.getDescription(),
                patched.getDueDate(),
                patched.getAssignedToUserId().getId(),
                patched.getTaskStatus(),
                patched.getTaskPriority(),
                patched.getCreatedAt(),
                patched.getAssignedBy().getEmail(),
                patched.getProject().getId()
        );
    }
    public TaskResponse updateTaskPriority(TaskPriorityPatch request, Long taskId){
        Task task = taskRepository.findById(taskId)
                .orElseThrow(()->new RuntimeException("Task not found"));
        task.setTaskPriority(request.getTaskPriority());
        Task patched = taskRepository.save(task);
        return new TaskResponse(
                patched.getId(),
                patched.getTitle(),
                patched.getDescription(),
                patched.getDueDate(),
                patched.getAssignedToUserId().getId(),
                patched.getTaskStatus(),
                patched.getTaskPriority(),
                patched.getCreatedAt(),
                patched.getAssignedBy().getEmail(),
                patched.getProject().getId()
        );
    }
}
