import axios from "axios";
import api from "../api/axios";
import type { Roles } from "../utils/Roles";

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
 token:string
}

interface UserResponse {
  id: Number,
  firstName: string;
  lastName: string;
  email: string;
  role: Roles;
}
interface RegisterRequest{
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  role: Roles
}
interface RegisterResponse {
  firstName: string;
  lastName: string;
  email: string;
  role: Roles;
}


export async function loginUser(email:string,password:string): Promise<LoginResponse> {
  const payload: LoginRequest = {
    email,
    password
  };

  try {
    const response = await api.post<LoginResponse>(
      'api/auth/login', 
      payload
    );
     
    return response.data
    
  } catch (error) {
    if (axios.isAxiosError(error)) {
        console.error("API Error:", error.response?.data);
    } else {
        console.error("Unexpected Error:", error);
    }
    throw error;
}
}
export async function registerUser(request:RegisterRequest): Promise<RegisterResponse> { 

  try {
    const response = await api.post<RegisterResponse>(
      'api/auth/register', 
      request
    );
     
    return response.data
    
  } catch (error) {
    if (axios.isAxiosError(error)) {
        console.error("API Error:", error.response?.data);
    } else {
        console.error("Unexpected Error:", error);
    }
    throw error;
}
}
export async function getCurrentUser(): Promise<UserResponse> {

    const response = await api.get<UserResponse>(
        "/api/users/me"
    );

    return response.data;
}

