import { createContext, useContext, useEffect, useState } from "react";

import {
  getAllWorkspaces,
  deleteWorkspacesById,
  getWorkspaceById,
  getMyWorkspaces
} from "../services/workspaceServices";

import {
  addMemberToTheWorkspace,
  getMembersOfWorkspace,
} from "../services/workspaceMembers";

import type { Roles } from "../utils/Roles";

export interface AppWorkspace {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  createdBy: string;
}

export interface WorkspaceMemberResponse {
  id: number;
  workspaceName: string;
  firstName: string;
  lastName: string;
  joinedAt: string;
  workspaceId: number;
  email: string;
  role: Roles;
}

interface WorkspaceContextType {
  workspaces: AppWorkspace[];
  currentWorkspace: AppWorkspace | null;
  loading: boolean;
  members: WorkspaceMemberResponse[];
  membersByWorkspaceId: Record<number, WorkspaceMemberResponse[]>;
  fetchWorkspaces: () => Promise<void>;
  fetchMyWorkspaces:() => Promise<void>;
  deleteWorkspace: (id: number) => Promise<void>;
  fetchWorkspaceById: (id: number) => Promise<void>;
  addMemberToWorkspace: (workspaceId: number,userId: number) => Promise<void>;
  fetchWorkspaceMembers: (workspaceId: number) => Promise<void>;
}

const WorkspaceContext = createContext<WorkspaceContextType | null>(null);

export function WorkspaceProvider({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  const [workspaces, setWorkspaces] = useState<AppWorkspace[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [currentWorkspace, setCurrentWorkspace] =
    useState<AppWorkspace | null>(null);

  const [members, setMembers] = useState<WorkspaceMemberResponse[]>([]);

  const [membersByWorkspaceId, setMembersByWorkspaceId] = useState<
    Record<number, WorkspaceMemberResponse[]>
  >({});

  const fetchWorkspaces = async (): Promise<void> => {
    setLoading(true);

    try {
      const data = await getAllWorkspaces();
      setWorkspaces(data);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const deleteWorkspace = async (id: number): Promise<void> => {
    await deleteWorkspacesById(id);

    setWorkspaces((prevWorkspaces) =>
      prevWorkspaces.filter((workspace) => workspace.id !== id)
    );

    setMembersByWorkspaceId((prev) => {
      const updatedMembers = { ...prev };
      delete updatedMembers[id];
      return updatedMembers;
    });
  };

  const fetchWorkspaceById = async (id: number): Promise<void> => {
    setLoading(true);

    try {
      const data = await getWorkspaceById(id);
      setCurrentWorkspace(data);
    } finally {
      setLoading(false);
    }
  };

  const fetchWorkspaceMembers = async (
    workspaceId: number
  ): Promise<void> => {
    setLoading(true);

    try {
      const data = await getMembersOfWorkspace(workspaceId);
      setMembers(data);
      setMembersByWorkspaceId((prev) => ({
        ...prev,
        [workspaceId]: data,
      }));
    } finally {
      setLoading(false);
    }
  };

  const addMemberToWorkspace = async (
    workspaceId: number,
    userId: number
  ): Promise<void> => {
    await addMemberToTheWorkspace(workspaceId, userId);

    await fetchWorkspaceMembers(workspaceId);
    await fetchWorkspaceById(workspaceId);
  };

  const fetchMyWorkspaces = async (): Promise<void> => {
  setLoading(true);

  try {
    const data = await getMyWorkspaces();
    setWorkspaces(data);
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
        members,
        membersByWorkspaceId,
        fetchWorkspaces,
        fetchMyWorkspaces,
        fetchWorkspaceById,
        deleteWorkspace,
        addMemberToWorkspace,
        fetchWorkspaceMembers,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspaces(): WorkspaceContextType {
  const context = useContext(WorkspaceContext);

  if (!context) {
    throw new Error("useWorkspaces must be used inside WorkspaceProvider");
  }

  return context;
}