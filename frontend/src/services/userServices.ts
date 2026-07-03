import api from "../api/axios";
import type { Roles } from "../utils/Roles";
export interface UserResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: Roles;
}

export async function getAllUsers():Promise<UserResponse[]>{
    const response = await api.get("http://localhost:8080/api/users")
    return response.data;   
}
export async function deleteUserById(id:number){
  const response = await api.delete(`http://localhost:8080/api/users/${id}`);
   return  response.data;
}