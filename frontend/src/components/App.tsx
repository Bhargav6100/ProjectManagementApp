import "../App.css";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Dashboard from "../pages/dashboard/Dashboard";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

import Settings from "../pages/settings/Settings";

import UsersList from "../pages/users/UsersList";
import EditUser from "../pages/users/EditUser";
import UserDetails from "../pages/users/UserDetails";

import WorkspaceList from "../pages/workspace/WorkspaceList";
import WorkspaceForm from "../pages/workspace/WorkspaceForm";
import WorkspaceDetails from "../pages/workspace/WorkspaceDetails";
import EditWorkspace from "../pages/workspace/EditWorkspaceForm";

import ProjectForm from "../pages/projects/ProjectForm";
import ProjectDetails from "../pages/projects/ProjectDetails";
import EditProject from "../pages/projects/EditProject";
import ProjectList from "../pages/projects/ProjectList";

import TaskForm from "../pages/tasks/TaskForm";
import TaskDetails from "../pages/tasks/TaskDetails";
import EditTask from "../pages/tasks/EditTask";
import TaskList from "../pages/tasks/TaskList";

import DashboardHome from "../pages/dashboard/DashboardHome";

function App(): React.JSX.Element {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<DashboardHome />} />
          <Route path="/dashboard/settings" element={<Settings/>}/>
          <Route path="users" element={<UsersList/>} />
          <Route path="users/create" element={<Register />} />
          <Route path="users/:id/edit" element={<EditUser />} />
          <Route path="users/:id" element={<UserDetails/>}/>

          <Route path="workspaces" element={<WorkspaceList />} />
          <Route path="workspaces/create" element={<WorkspaceForm />} />
          <Route path="workspaces/:id" element={<WorkspaceDetails />} />
          <Route path="workspaces/:id/edit" element={<EditWorkspace />} />

          <Route path="projects" element={<ProjectList />} />

          <Route
            path="workspaces/:workspaceId/projects/create"
            element={<ProjectForm />}
          />

          <Route
            path="workspaces/:workspaceId/projects/:projectId"
            element={<ProjectDetails />}
          />

          <Route
            path="workspaces/:workspaceId/projects/:projectId/edit"
            element={<EditProject />}
          />

          <Route path="tasks" element={<TaskList />} />
          <Route path="my-tasks" element={<TaskList mode="assignedToMe" />} />
          <Route
            path="my-assigned-tasks"
            element={<TaskList mode="createdByMe" />}
          />

          <Route
            path="workspaces/:workspaceId/projects/:projectId/tasks/create"
            element={<TaskForm />}
          />

          <Route
            path="workspaces/:workspaceId/projects/:projectId/tasks/:taskId"
            element={<TaskDetails />}
          />

          <Route
            path="workspaces/:workspaceId/projects/:projectId/tasks/:taskId/edit"
            element={<EditTask />}
          />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;