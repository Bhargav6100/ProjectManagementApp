import api from "../api/axios";
import type { ProjectStatus } from "../utils/ProjectStatus";

export interface ProjectRequest {
  name: string;
  description: string;
  status: ProjectStatus;
}

export interface ProjectResponse {
  id: number;
  name: string;
  description: string;
  status: ProjectStatus;
  workspaceId: number;
  createdBy: string;
  createdAt: string;
}

export async function createProject(workspaceId: number,request: ProjectRequest):Promise<ProjectResponse> {
  const response = await api.post<ProjectResponse>(`/api/workspaces/${workspaceId}/projects`,request);

  return response.data;
}
export async function getAllProjects():Promise<ProjectResponse[]>{
  const response = await api.get("api/projects")

  return response.data;
}
export async function getMyProjects(): Promise<ProjectResponse[]> {
  const response = await api.get<ProjectResponse[]>("/api/projects/my-projects");
  return response.data;
}
export async function getProjectById(id:number):Promise<ProjectResponse>{
    const response = await api.get(`/api/projects/${id}`)
   
    return response.data;
}
export async function getProjectsByWorkspace(workspaceId:number){
    const response = await api.get(`/api/workspaces/${workspaceId}/projects`)
    return response.data;   
}
export async function updateProject(projectId: number,request: ProjectRequest): Promise<ProjectResponse> {
  const response = await api.put<ProjectResponse>(`/api/projects/${projectId}`,request);
  return response.data;
}
export async function deleteProjectById(projectId:Number){
  const response = await api.delete(`/api/projects/${projectId}`);
   
  return  response.data;
}
