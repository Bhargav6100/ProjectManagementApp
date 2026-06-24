package com.ProjectManagementApp.Controller;

import com.ProjectManagementApp.dto.*;
import com.ProjectManagementApp.entity.TaskPriority;
import com.ProjectManagementApp.entity.User;
import com.ProjectManagementApp.repository.UserRepository;
import com.ProjectManagementApp.service.TaskService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class TaskController {
    private final TaskService taskService;
    private final UserRepository userRepository;
    public TaskController(TaskService taskService, UserRepository userRepository) {
        this.taskService = taskService;
        this.userRepository = userRepository;
    }
    @PostMapping("/api/projects/{projectId}/tasks")
    public ResponseEntity<TaskResponse> createTask(@PathVariable Long projectId, @RequestBody TaskRequest request, Authentication authentication){
        String email = authentication.getName();

        User currentUser = userRepository.findByEmail(email)
                .orElseThrow();

        TaskResponse response = taskService.createTask(request, projectId,currentUser);

        return ResponseEntity.ok(response);
    }
    @GetMapping("/api/projects/{projectId}/tasks")
    public ResponseEntity<List<TaskResponse>> getTasksByProject(
            @PathVariable Long projectId
    ) {
        return ResponseEntity.ok(taskService.getTaskByProjectId(projectId));
    }
    @GetMapping("/api/tasks/{id}")
    public ResponseEntity<TaskResponse> findTaskById(@PathVariable Long id){
        try {
            return ResponseEntity.ok(taskService.getTasksByTaskId(id));
        } catch (RuntimeException ex) {
            return ResponseEntity.notFound().build();
        }
    }
    @PutMapping("/api/tasks/{taskId}")
    public ResponseEntity<TaskResponse> updateTask(@PathVariable Long taskId,
                                                         @RequestBody TaskRequest request,
                                                         Authentication authentication){
        String email =authentication.getName();
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow();

        TaskResponse response = taskService.updateTask(request,taskId);
        return ResponseEntity.ok(response);
    }
    @PatchMapping("/api/tasks/{taskId}/status")
    public ResponseEntity<TaskResponse> updateTaskStatus(
            @PathVariable Long taskId,
            @RequestBody TaskStatusPatch request
    ) {

        return ResponseEntity.ok(
                taskService.updateTaskStatus(
                        request,
                        taskId
                )
        );
    }
    @PatchMapping("/api/tasks/{taskId}/priority")
    public ResponseEntity<TaskResponse> updateTaskPriority(
            @PathVariable Long taskId,
            @RequestBody TaskPriorityPatch request
    ) {

        return ResponseEntity.ok(
                taskService.updateTaskPriority(
                        request,
                        taskId
                )
        );
    }
}
