import api from "../api/axios";
export interface WorkspaceRequest {
  name: string;
  description: string;
}


export interface WorkspaceResponse {
  id: number;
  name: string;
  description: string;
  createdAt: Date;
  createdBy: string;
}

export async function getAllWorkspaces():Promise<WorkspaceResponse[]>{
    const response = await api.get("http://localhost:8080/api/workspaces")
    return response.data;   
}
export async function deleteWorkspacesById(id:Number){
  const response = await api.delete(`http://localhost:8080/api/workspaces/${id}`);
   return  response.data;
}
export async function createWorkspace(
  request: WorkspaceRequest
): Promise<WorkspaceResponse> {
  const response = await api.post<WorkspaceResponse>("/api/workspaces", request);
  return response.data;
}