package com.ProjectManagementApp.Controller;

import com.ProjectManagementApp.dto.*;
import com.ProjectManagementApp.entity.User;
import com.ProjectManagementApp.exception.ResourceNotFoundException;
import com.ProjectManagementApp.repository.UserRepository;
import com.ProjectManagementApp.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.AccessDeniedException;
import java.util.List;

@RestController
@RequestMapping("/api")
public class TaskController {

    private final TaskService taskService;
    private final UserRepository userRepository;

    public TaskController(TaskService taskService, UserRepository userRepository) {
        this.taskService = taskService;
        this.userRepository = userRepository;
    }

    @PostMapping("/projects/{projectId}/tasks")
    public ResponseEntity<TaskResponse> createTask(
            @PathVariable Long projectId,
            @Valid @RequestBody TaskRequest request,
            Authentication authentication) throws AccessDeniedException {

        User currentUser = getCurrentUser(authentication);
        return ResponseEntity.ok(taskService.createTask(request, projectId, currentUser));
    }

    @GetMapping("/projects/{projectId}/tasks")
    public ResponseEntity<List<TaskResponse>> getTasksByProject(
            @PathVariable Long projectId,
            Authentication authentication) throws AccessDeniedException {

        User currentUser = getCurrentUser(authentication);
        return ResponseEntity.ok(taskService.getTaskByProjectId(projectId, currentUser));
    }
    @GetMapping("/tasks")
    public ResponseEntity<List<TaskResponse>> getAllTasks() {
        return ResponseEntity.ok(taskService.getAllTasks());
    }
    @GetMapping("/tasks/{id}")
    public ResponseEntity<TaskResponse> findTaskById(
            @PathVariable Long id,
            Authentication authentication) throws AccessDeniedException {

        User currentUser = getCurrentUser(authentication);
        return ResponseEntity.ok(taskService.getTasksByTaskId(id, currentUser));
    }

    @GetMapping("/tasks/my-tasks")
    public ResponseEntity<List<TaskResponse>> getMyTasks(Authentication authentication) {

        User currentUser = getCurrentUser(authentication);
        return ResponseEntity.ok(taskService.getMyAssignedTasks(currentUser));
    }
    @GetMapping("/tasks/my-assigned-tasks")
    public ResponseEntity<List<TaskResponse>> getMyAssignedTasks(Authentication authentication) {

        User currentUser = getCurrentUser(authentication);
        return ResponseEntity.ok(taskService.getAllTasksAssignedByMe(currentUser));
    }

    @PutMapping("/tasks/{taskId}")
    public ResponseEntity<TaskResponse> updateTask(
            @PathVariable Long taskId,
            @Valid @RequestBody TaskRequest request,
            Authentication authentication) throws AccessDeniedException {

        User currentUser = getCurrentUser(authentication);
        return ResponseEntity.ok(taskService.updateTask(request, taskId, currentUser));
    }

    @PatchMapping("/tasks/{taskId}/status")
    public ResponseEntity<TaskResponse> updateTaskStatus(
            @PathVariable Long taskId,
            @Valid @RequestBody TaskStatusPatch request,
            Authentication authentication) throws AccessDeniedException {

        User currentUser = getCurrentUser(authentication);
        return ResponseEntity.ok(taskService.updateTaskStatus(request, taskId, currentUser));
    }

    @PatchMapping("/tasks/{taskId}/priority")
    public ResponseEntity<TaskResponse> updateTaskPriority(
            @PathVariable Long taskId,
            @Valid @RequestBody TaskPriorityPatch request,
            Authentication authentication) throws AccessDeniedException {

        User currentUser = getCurrentUser(authentication);
        return ResponseEntity.ok(taskService.updateTaskPriority(request, taskId, currentUser));
    }

    @DeleteMapping("/tasks/{taskId}")
    public ResponseEntity<String> deleteTask(
            @PathVariable Long taskId,
            Authentication authentication) throws AccessDeniedException {

        User currentUser = getCurrentUser(authentication);
        return ResponseEntity.ok(taskService.deleteTask(taskId, currentUser));
    }

    private User getCurrentUser(Authentication authentication) {
        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}
