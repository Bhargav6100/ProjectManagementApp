import axios from "axios";
import api from "../api/axios";

interface UserPayload {
  email: string;
  password: string;
}

interface UserResponse {
 token:string
}

export async function loginUser(email:string,password:string): Promise<UserResponse> {
  const payload: UserPayload = {
    email,
    password
  };

  try {
    const response = await api.post<UserResponse>(
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