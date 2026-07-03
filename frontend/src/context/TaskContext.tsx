import { createContext, useContext, useState } from "react";
import type { TaskStatus } from "../utils/TaskStatus";
import type { TaskPriority } from "../utils/TaskPriority";
import {
  getAllTasks,
  deleteTaskById,
  getTaskById,
  getTasksByProject,
} from "../services/taskServices";

export interface AppTask {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  assignedToUserId: number;
  assignedToName?: string;
  taskStatus: TaskStatus;
  taskPriority: TaskPriority;
  projectId: number;
  createdBy: string;
  createdAt: string;
}

interface TaskContextType {
  tasks: AppTask[];
  allTasks: AppTask[];
  currentTask: AppTask | null;
  loading: boolean;
  fetchAllTasks:() => Promise<void>;
  fetchTasksByProject: (projectId: number) => Promise<void>;
  fetchTaskById: (taskId: number) => Promise<void>;
  deleteTask: (taskId: number) => Promise<void>;
}

const TaskContext = createContext<TaskContextType | null>(null);

export function TaskProvider({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  const [tasks, setTasks] = useState<AppTask[]>([]);
  const [allTasks,setAllTasks]=useState<AppTask[]>([]);
  const [currentTask, setCurrentTask] = useState<AppTask | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchTasksByProject = async (projectId: number): Promise<void> => {
    setLoading(true);

    try {
      const data = await getTasksByProject(projectId);
      setTasks(data);
    } finally {
      setLoading(false);
    }
  };
   const fetchAllTasks = async():Promise<void> =>{
      setLoading(true);
  
      try{
        const data = await getAllTasks();
         setAllTasks(data);
      }
      finally{
        setLoading(false);
      }
    }

  const fetchTaskById = async (taskId: number): Promise<void> => {
    setLoading(true);

    try {
      const data = await getTaskById(taskId);
      setCurrentTask(data);
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (taskId: number): Promise<void> => {
    await deleteTaskById(taskId);

    setTasks((prevTasks) =>
      prevTasks.filter((task) => task.id !== taskId)
    );
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        allTasks,
        currentTask,
        loading,
        fetchAllTasks,
        fetchTasksByProject,
        fetchTaskById,
        deleteTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks(): TaskContextType {
  const context = useContext(TaskContext);

  if (!context) {
    throw new Error("useTasks must be used inside TaskProvider");
  }

  return context;
}