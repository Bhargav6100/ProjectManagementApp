import { createContext, useContext, useEffect, useState } from "react";
import { getAllWorkspaces,deleteWorkspacesById,getWorkspaceById} from "../services/workspaceServices";
export interface AppWorkspace {
  id:number, 
  name: string;
  description: string;
  createdAt: string;
  createdBy: string;
}
interface WorkspaceContextType {
  workspaces: AppWorkspace[];
  currentWorkspace : AppWorkspace | null;
  loading: boolean;
  fetchWorkspaces: () => Promise<void>;
  deleteWorkspace: (id: Number) => Promise<void>;
  fetchWorkspaceById:(id:number) =>Promise<void>
}

const WorkspaceContext = createContext<WorkspaceContextType | null>(null);

export function WorkspaceProvider({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  const [workspaces, setWorkspaces] = useState<AppWorkspace[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentWorkspace,setCurrentWorkspace]=useState<AppWorkspace | null>(null);

  const fetchWorkspaces = async (): Promise<void> => {
    setLoading(true);

    try {
      const data = await getAllWorkspaces();
      setWorkspaces(data);
    } finally {
      setLoading(false);
    }
  };

  const deleteWorkspace = async (id: Number): Promise<void> => {
    await deleteWorkspacesById(id);

    setWorkspaces((prevWorkspaces) =>
      prevWorkspaces.filter((workspaces) => workspaces.id!== id)
    );
  };

  useEffect(() => {
    fetchWorkspaces();
  }, []);
  
  const fetchWorkspaceById = async (id:number): Promise<void> => {
    setLoading(true);

    try {
      const data = await getWorkspaceById(id);
      setCurrentWorkspace(data);
    } finally {
      setLoading(false);
    }
  };
  return (
    <WorkspaceContext.Provider
      value={{
        workspaces,
        currentWorkspace,
        loading,
        fetchWorkspaces,
        fetchWorkspaceById,
        deleteWorkspace,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspaces(): WorkspaceContextType {
  const context = useContext(WorkspaceContext);

  if (!context) {
    throw new Error("Workspaces must be used inside WorkspaceProvider");
  }

  return context;
}