import '../App.css'
import Login from '../pages/auth/Login.tsx'
import Register from '../pages/auth/Register.tsx'
import Dashboard from '../pages/dashboard/Dashboard.tsx'
import { Route,Routes } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute.tsx'
import UsersList from '../pages/users/UsersList.tsx'
import WorkspaceList from '../pages/workspace/WorkspaceList.tsx'
import WorkspaceForm from '../pages/workspace/WorkspaceForm.tsx'
import WorkspaceDetails from '../pages/workspace/WorkspaceDetails.tsx'
import EditWorkspace from '../pages/workspace/EditWorkspaceForm.tsx'
import ProjectForm from '../pages/projects/ProjectForm.tsx'
import ProjectDetails from '../pages/projects/ProjectDetails.tsx'
import EditProject from '../pages/projects/EditProject.tsx'
import TaskForm from '../pages/tasks/TaskForm.tsx'
function App() {
 
  return (
    <>
    <Routes>
    <Route path="/login" Component={Login}/>
    <Route path="/signup" Component={Register}/> 
    <Route path="/users" Component={UsersList}/>
    <Route path="/workspaces" Component={WorkspaceList}/>
    <Route element={<ProtectedRoute />}>
        {/* <Route path="/admin" element={<AdminPanel />}> */}
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/dashboard/workspaces/create" element={<WorkspaceForm/>}/>
  <Route path="/dashboard/workspaces/:id" element={<WorkspaceDetails/>}/>
  <Route path="/dashboard/workspaces/:id/edit" element={<EditWorkspace/>}/>
  <Route path="/dashboard/workspaces/:workspaceId/projects/create" element={<ProjectForm/>}/>
  <Route path="/dashboard/workspaces/:workspaceId/projects/:projectId" element={<ProjectDetails/>}/>
  <Route path="/dashboard/workspaces/:workspaceId/projects/:projectId/edit" element={<EditProject />}/>
  <Route path="/dashboard/workspaces/:workspaceId/projects/:projectId/tasks/create" element={<TaskForm />}/>
</Route>
        {/* <Route path="/workspaces" element={<WorkspaceList />} />
        <Route path="/projects" element={<ProjectList />} />
        <Route path="/tasks" element={<TaskList />} /> */}
    </Routes>
    </>
  )
}

export default App
