import { createContext, useContext, useState } from "react";
import type { ProjectStatus } from "../utils/ProjectStatus";
import {
  getAllProjects,
  getProjectsByWorkspace,
  getProjectById,
  deleteProjectById,
} from "../services/projectServices";

export interface AppProject {
  id: number;
  name: string;
  description: string;
  status: ProjectStatus;
  workspaceId: number;
  createdBy: string;
  createdAt: string;
}

interface ProjectContextType {
  projects: AppProject[];
  currentProject: AppProject | null;
  loading: boolean;
  allProjects: AppProject[];
  fetchProjectsByWorkspace: (workspaceId: number) => Promise<void>;
  fetchProjectById: (projectId: number) => Promise<void>;
  fetchAllProjects: ()=> Promise<void>;
  deleteProject: (projectId: number) => Promise<void>;
}

const ProjectContext = createContext<ProjectContextType | null>(null);

export function ProjectProvider({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  const [projects, setProjects] = useState<AppProject[]>([]);
  const [currentProject, setCurrentProject] = useState<AppProject | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [allProjects,setAllProjects] = useState<AppProject[]>([]);

  const fetchProjectsByWorkspace = async (
    workspaceId: number
  ): Promise<void> => {
    setLoading(true);

    try {
      const data = await getProjectsByWorkspace(workspaceId);
      setProjects(data);
    } finally {
      setLoading(false);
    }
  };
  const fetchAllProjects = async():Promise<void> =>{
    setLoading(true);

    try{
      const data = await getAllProjects();
       setAllProjects(data);
    }
    finally{
      setLoading(false);
    }
  }

  const fetchProjectById = async (projectId: number): Promise<void> => {
    setLoading(true);

    try {
      const data = await getProjectById(projectId);
      setCurrentProject(data);
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (projectId: number): Promise<void> => {
    await deleteProjectById(projectId);

    setProjects((prevProjects) =>
      prevProjects.filter((project) => project.id !== projectId)
    );
    setAllProjects((prevProjects) =>
    prevProjects.filter((project) => project.id !== projectId)
  );
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        currentProject,
        loading,
        allProjects,
        fetchAllProjects,
        fetchProjectsByWorkspace,
        fetchProjectById,
        deleteProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjects(): ProjectContextType {
  const context = useContext(ProjectContext);

  if (!context) {
    throw new Error("useProjects must be used inside ProjectProvider");
  }

  return context;
}