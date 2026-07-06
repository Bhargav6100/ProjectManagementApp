import api from "../api/axios";
import type { TaskStatus } from "../utils/TaskStatus"
import type { TaskPriority } from "../utils/TaskPriority";

export interface TaskRequest {
  title: string;
  description: string;
  dueDate: string;
  assignedToUserId: number;
  taskStatus: TaskStatus;
  taskPriority: TaskPriority;
}

export interface TaskResponse {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  assignedToUserId: number;
  assignedToName?: string;
  taskStatus: TaskStatus;
  taskPriority: TaskPriority;
  projectId: number;
  createdBy: string;
  createdAt: string;
}

export async function createTask(projectId: number,request: TaskRequest):Promise<TaskResponse> {
  const response = await api.post<TaskResponse>(`/api/projects/${projectId}/tasks`,request);
  return response.data;
}

export async function getAllTasks():Promise<TaskResponse[]>{
  const response = await api.get("/api/tasks")

  return response.data;
}

export async function getTasksByProject(projectId: number): Promise<TaskResponse[]> {
  const response = await api.get<TaskResponse[]>(`/api/projects/${projectId}/tasks`);
  return response.data;
}

export async function getTaskById(id: number): Promise<TaskResponse> {
  const response = await api.get<TaskResponse>(`/api/tasks/${id}`);
  return response.data;
}
export async function getMyTasks():Promise<TaskResponse[]>{
  const response = await api.get("/api/tasks/my-tasks");
  return response.data;
}
export async function getTasksCreatedByMe():Promise<TaskResponse[]>{
  const response = await api.get("/api/tasks/my-assigned-tasks");
  return response.data;
}
export async function updateTask(taskId: number,request: TaskRequest): Promise<TaskResponse> {
  const response = await api.put<TaskResponse>(`/api/tasks/${taskId}`,request);
  return response.data;
}

export async function deleteTaskById(taskId: number): Promise<string> {
  const response = await api.delete<string>(`/api/tasks/${taskId}`);
  return response.data;
}