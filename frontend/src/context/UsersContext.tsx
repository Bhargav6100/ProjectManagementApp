import { createContext, useContext, useEffect,useState } from "react";
import type { Roles } from "../utils/Roles";
import { getAllUsers,getUserById,deleteUserById,getAllInactiveUsers} from "../services/userServices";

export interface AppUser {
  id:number, 
  firstName: string;
  lastName: string;
  email: string;
  role: Roles;
  createdAt :string;
  active: boolean
}

export interface UsersContextType {
  users: AppUser[];
  inActiveUsers:AppUser[];
  currentUser: AppUser | null;
  loading: boolean;
  fetchUsers: () => Promise<void>;
  fetchInactiveUsers:() => Promise<void>;
  fetchUserById: (id : number) => Promise<void>;
  deleteUser: (id: number) => Promise<void>;
}

const UsersContext = createContext<UsersContextType | null>(null);

export function UsersProvider({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [inActiveUsers,setInActiveUsers]=useState<AppUser[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentUser,setCurrentuser] = useState<AppUser | null>(null);
  const fetchUsers = async (): Promise<void> => {
    setLoading(true);

    try {
      const data = await getAllUsers();
      setUsers(data);
    } finally {
      setLoading(false);
    }
  };
  const fetchUserById = async(id: number): Promise<void> =>{
    const data = await getUserById(id);

    setCurrentuser(data);
  }
  const fetchInactiveUsers = async():Promise<void> =>{
    const data = await getAllInactiveUsers();
    setInActiveUsers(data);
  }
  const deleteUser = async (id: number): Promise<void> => {
    await deleteUserById(id);

    setUsers((prevUsers) =>
      prevUsers.filter((user) => user.id!== id)
    );
  };
  useEffect(()=>{
   fetchUsers(),
   fetchInactiveUsers()
  },[])


  return (
    <UsersContext.Provider
      value={{
        users,
        inActiveUsers,
        currentUser,
        loading,
        fetchUsers,
        fetchInactiveUsers,
        fetchUserById,
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