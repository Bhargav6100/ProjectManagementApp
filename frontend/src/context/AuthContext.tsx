import { createContext, useContext, useEffect, useState } from "react";
import type {Roles}  from "../utils/Roles";

export interface User{
    firstName:string,
    lastName:string,
    email:string,
    role: Roles
}
interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
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

    useEffect(() => {
        const token = localStorage.getItem("token");

        setIsAuthenticated(!!token);
    }, []);

    const login = (token: string) => {
        localStorage.setItem("token", token);
        setIsAuthenticated(true);

        if(user){
        setUser(user);
    }
    };

    const logout = () => {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
    };
    

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
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