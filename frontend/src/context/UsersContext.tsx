import { createContext, useContext, useEffect, useState } from "react";
import type { Roles } from "../utils/Roles";
import { getAllUsers,deleteUserById} from "../services/userServices";

export interface AppUser {
  id:Number, 
  firstName: string;
  lastName: string;
  email: string;
  role: Roles;
}

interface UsersContextType {
  users: AppUser[];
  loading: boolean;
  fetchUsers: () => Promise<void>;
  deleteUser: (id: Number) => Promise<void>;
}

const UsersContext = createContext<UsersContextType | null>(null);

export function UsersProvider({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchUsers = async (): Promise<void> => {
    setLoading(true);

    try {
      const data = await getAllUsers();
      setUsers(data);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id: Number): Promise<void> => {
    await deleteUserById(id);

    setUsers((prevUsers) =>
      prevUsers.filter((user) => user.id!== id)
    );
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <UsersContext.Provider
      value={{
        users,
        loading,
        fetchUsers,
        deleteUser
      }}
    >
      {children}
    </UsersContext.Provider>
  );
}

export function useUsers(): UsersContextType {
  const context = useContext(UsersContext);

  if (!context) {
    throw new Error("Users must be used inside UsersProvider");
  }

  return context;
}