package com.ProjectManagementApp.service;

import com.ProjectManagementApp.dto.*;
import com.ProjectManagementApp.entity.Project;
import com.ProjectManagementApp.entity.Roles;
import com.ProjectManagementApp.entity.Task;
import com.ProjectManagementApp.entity.User;
import com.ProjectManagementApp.exception.ResourceNotFoundException;
import com.ProjectManagementApp.repository.ProjectRepository;
import com.ProjectManagementApp.repository.TaskRepository;
import com.ProjectManagementApp.repository.UserRepository;
import com.ProjectManagementApp.repository.WorkspaceMemberRepository;
import org.springframework.stereotype.Service;

import java.nio.file.AccessDeniedException;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final WorkspaceMemberRepository workspaceMemberRepository;

    public TaskService(TaskRepository taskRepository, ProjectRepository projectRepository, UserRepository userRepository, WorkspaceMemberRepository workspaceMemberRepository) {
        this.taskRepository = taskRepository;
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
        this.workspaceMemberRepository = workspaceMemberRepository;
    }

    public TaskResponse getTasksByTaskId(Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task with that Id not found"));
        return new TaskResponse(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getDueDate(),
                task.getAssignedTo().getFirstName() + " " + task.getAssignedTo().getLastName(),
                task.getAssignedTo().getId(),
                task.getTaskStatus(),
                task.getTaskPriority(),
                task.getCreatedAt(),
                task.getAssignedBy().getEmail(),
                task.getProject().getId()
        );
    }

    public List<TaskResponse> getTaskByProjectId(Long projectId) {
        return taskRepository.findByProjectId(projectId)
                .stream()
                .map(task -> new TaskResponse(
                        task.getId(),
                        task.getTitle(),
                        task.getDescription(),
                        task.getDueDate(),
                        task.getAssignedTo().getFirstName() + " " + task.getAssignedTo().getLastName(),
                        task.getAssignedTo().getId(),
                        task.getTaskStatus(),
                        task.getTaskPriority(),
                        task.getCreatedAt(),
                        task.getAssignedBy().getEmail(),
                        task.getProject().getId()
                ))
                .toList();
    }

    public TaskResponse createTask(TaskRequest request, Long projectId, User currentUser) throws AccessDeniedException {
        Project project = projectRepository.findById(projectId).orElseThrow(() -> new ResourceNotFoundException("Project not found"));
        User assignedTo = userRepository.findById(request.getAssignedToUserId())
                .orElseThrow();
        Long workspaceId = project.getWorkspace().getId();

        if (currentUser.getRole().equals(Roles.PROJECT_MANAGER)) {

            boolean isProjectCreator = projectRepository
                    .existsByIdAndCreatedById(project.getId(),currentUser.getId());

            if (!isProjectCreator) {
                throw new AccessDeniedException("only project creater can create task");
            }

        } else if (!currentUser.getRole().equals(Roles.ADMIN)) {
            throw new AccessDeniedException("Only admin or creator of this project can create tasks");
        }

        boolean assignedUserBelongsToWorkspace =
                workspaceMemberRepository.existsByWorkspaceIdAndUserId(
                        workspaceId,
                        assignedTo.getId()
                );

        if (!assignedUserBelongsToWorkspace) {
            throw new AccessDeniedException("Assigned user is not a member of this workspace");
        }

        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setDueDate(request.getDueDate());
        task.setProject(project);
        task.setAssignedTo(assignedTo);
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
                saved.getAssignedTo().getFirstName() + " " + saved.getAssignedTo().getLastName(),
                saved.getAssignedTo().getId(),
                saved.getTaskStatus(),
                saved.getTaskPriority(),
                saved.getCreatedAt(),
                saved.getAssignedBy().getEmail(),
                saved.getProject().getId()
        );
    }

    public TaskResponse updateTask(TaskRequest request, Long taskId, User currentUser) throws AccessDeniedException {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));
        if (currentUser.getRole().equals(Roles.PROJECT_MANAGER)) {

            boolean isTaskAssigner = taskRepository
                    .existsByIdAndAssignedById(task.getId(),currentUser.getId());

            if (!isTaskAssigner) {
                throw new AccessDeniedException("Only the user who assigned this task can update it");
            }

        } else if (!currentUser.getRole().equals(Roles.ADMIN)) {
            throw new AccessDeniedException("Only admin or task assigner can update tasks");
        }
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setTaskStatus(request.getTaskStatus());
        task.setTaskPriority(request.getTaskPriority());
        Task update = taskRepository.save(task);
        return new TaskResponse(
                update.getId(),
                update.getTitle(),
                update.getDescription(),
                update.getDueDate(),update.getAssignedTo().getFirstName() + " " + update.getAssignedTo().getLastName(),
                update.getAssignedTo().getId(),
                update.getTaskStatus(),
                update.getTaskPriority(),
                update.getCreatedAt(),
                update.getAssignedBy().getEmail(),
                update.getProject().getId()
        );
    }

    public TaskResponse updateTaskStatus(TaskStatusPatch request, Long taskId, User currentUser) throws AccessDeniedException {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));
        if (currentUser.getRole().equals(Roles.PROJECT_MANAGER)) {

            boolean isTaskAssigner = taskRepository
                    .existsByIdAndAssignedById(task.getId(),currentUser.getId());

            if (!isTaskAssigner) {
                throw new AccessDeniedException("Only the user who assigned this or a user who its assigned to can update status");
            }

        } else if (currentUser.getRole().equals(Roles.MEMBER)) {
             boolean isTaskAssignedTo=taskRepository.existsByIdAndAssignedToId(task.getId(),currentUser.getId());
            if (!isTaskAssignedTo) {
                throw new AccessDeniedException("Only the user who assigned this or a user who its assigned to can update status");
            }
        }else if (!currentUser.getRole().equals(Roles.ADMIN)) {
            throw new AccessDeniedException(" Only admin, task assigner, or task assignee can update task status");
        }

        task.setTaskStatus(request.getTaskStatus());
        Task patched = taskRepository.save(task);
        return new TaskResponse(
                patched.getId(),
                patched.getTitle(),
                patched.getDescription(),
                patched.getDueDate(),
                patched.getAssignedTo().getFirstName() + " " + patched.getAssignedTo().getLastName(),
                patched.getAssignedTo().getId(),
                patched.getTaskStatus(),
                patched.getTaskPriority(),
                patched.getCreatedAt(),
                patched.getAssignedBy().getEmail(),
                patched.getProject().getId()
        );
    }

    public TaskResponse updateTaskPriority(TaskPriorityPatch request, Long taskId, User currentUser) throws AccessDeniedException {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));
        if (currentUser.getRole().equals(Roles.PROJECT_MANAGER)) {

            boolean isTaskAssigner = taskRepository
                    .existsByIdAndAssignedById(task.getId(),currentUser.getId());

            if (!isTaskAssigner) {
                throw new AccessDeniedException("Only the user who assigned this task can update priority");
            }

        } else if (!currentUser.getRole().equals(Roles.ADMIN)) {
            throw new AccessDeniedException("Only admin or task assigner can update priority");
        }
        task.setTaskPriority(request.getTaskPriority());
        Task patched = taskRepository.save(task);
        return new TaskResponse(
                patched.getId(),
                patched.getTitle(),
                patched.getDescription(),
                patched.getDueDate(),
                patched.getAssignedTo().getFirstName() + " " + patched.getAssignedTo().getLastName(),
                patched.getAssignedTo().getId(),
                patched.getTaskStatus(),
                patched.getTaskPriority(),
                patched.getCreatedAt(),
                patched.getAssignedBy().getEmail(),
                patched.getProject().getId()
        );
    }

    public String deleteTask(Long taskId, User currentUser) throws AccessDeniedException {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));
        if (currentUser.getRole().equals(Roles.PROJECT_MANAGER)) {

            boolean isTaskAssigner = taskRepository
                    .existsByIdAndAssignedById(task.getId(),currentUser.getId());

            if (!isTaskAssigner) {
                throw new AccessDeniedException("Only the user who assigned this task can delete");
            }

        } else if (!currentUser.getRole().equals(Roles.ADMIN)) {
            throw new AccessDeniedException("Only admin or task assigner can delete");
        }
        taskRepository.delete(task);
        return "Task deleted successfully";
    }

    public List<TaskResponse> getTaskAssignedToUser(Long userId) {
        return taskRepository.findByAssignedToId(userId)
                .stream()
                .map(task -> new TaskResponse(
                        task.getId(),
                        task.getTitle(),
                        task.getDescription(),
                        task.getDueDate(),
                        task.getAssignedTo().getFirstName() + " " + task.getAssignedTo().getLastName(),
                        task.getAssignedTo().getId(),
                        task.getTaskStatus(),
                        task.getTaskPriority(),
                        task.getCreatedAt(),
                        task.getAssignedBy().getEmail(),
                        task.getProject().getId()
                ))
                .toList();
    }
}
