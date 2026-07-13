import { createContext, useContext, useEffect, useState } from "react";
import type {Roles}  from "../utils/Roles";
import { getCurrentUser } from "../services/authServices";

export interface User{
    id:number,
    firstName:string,
    lastName:string,
    email:string,
    role: Roles
}
interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean,
    login: (token: string, user?:User) => void;
    logout: () => void;
    setUser :(user: User) => void
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user,setUser]=useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
    const restoreUser = async (): Promise<void> => {
      const token = localStorage.getItem("token");

      if (!token) {
        setIsAuthenticated(false);
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        setIsAuthenticated(true);

        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreUser();
  }, []);
     const login = (token: string, userData?: User): void => {
    localStorage.setItem("token", token);
    setIsAuthenticated(true);

    if (userData) {
      setUser(userData);
    }
  };

     const logout = (): void => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUser(null);
  };
    

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                loading,
                login,
                logout,
                setUser
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider");
    }

    return context;
}