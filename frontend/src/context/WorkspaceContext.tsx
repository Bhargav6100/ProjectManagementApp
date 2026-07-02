import { createContext, useContext, useEffect, useState } from "react";
import { getAllWorkspaces,deleteWorkspacesById} from "../services/workspaceServices";

export interface AppWorkspace {
  id:number, 
  name: string;
  description: string;
  createdAt: Date;
  createdBy: string;
}

interface WorkspaceContextType {
  workspaces: AppWorkspace[];
  loading: boolean;
  fetchWorkspaces: () => Promise<void>;
  deleteWorkspace: (id: Number) => Promise<void>;
}

const WorkspaceContext = createContext<WorkspaceContextType | null>(null);

export function WorkspaceProvider({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  const [workspaces, setWorkspaces] = useState<AppWorkspace[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

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

  return (
    <WorkspaceContext.Provider
      value={{
        workspaces,
        loading,
        fetchWorkspaces,
        deleteWorkspace
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