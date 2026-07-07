import api from "../api/axios";
import type { Roles } from "../utils/Roles";
export interface UserRequest{
  firstName: string,
  lastName: string,
  email: string,
  role: Roles
}
export interface UserResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: Roles;
  createdAt: string;
  active: boolean;
}

export async function getAllUsers():Promise<UserResponse[]>{
    const response = await api.get("/api/users/active")
    return response.data;   
}
export async function getAllInactiveUsers():Promise<UserResponse[]>{
    const response = await api.get("/api/users/inactive")
    return response.data;
}
export async function getUserById(id:number):Promise<UserResponse>{
    const response = await api.get(`/api/users/${id}`)
    return response.data;  
}
export async function updateUser(id:number,request:UserRequest):Promise<UserResponse>{
   const response = await api.put<UserResponse>(`/api/users/${id}`,request)
   return response.data;
}
export async function deleteUserById(id:number){
  const response = await api.delete(`/api/users/${id}`);
   return  response.data;
}