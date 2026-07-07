import type {Roles} from '../utils/Roles'
import api from '../api/axios';
export interface WorkspaceMemberResponse {
  id: number;
  workspaceName: string;
  firstName: string;
  lastName: string;
  joinedAt: string;
  workspaceId: number;
  email: string,
  role:Roles,
}
export interface UserResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: Roles;
}

export async function addMemberToTheWorkspace(workspaceId:number,userId:number):Promise<WorkspaceMemberResponse>{
  const response = await api.post(`/api/workspaces/${workspaceId}/members/${userId}`)
  return response.data;
}
export async function getMembersOfWorkspace(workspaceId:number):Promise<WorkspaceMemberResponse[]>{
    const response = await api.get(`/api/workspaces/${workspaceId}/members`)
    return response.data;
}
export async function removeMemberFromTheWorkspace(workspaceId:number,userId:number):Promise<void>{
    const response = await api.delete(`/api/workspaces/${workspaceId}/members/${userId}`)
    return response.data;
}