import '../App.css'
import Login from '../pages/auth/Login.tsx'
import Register from '../pages/auth/Register.tsx'
import Dashboard from '../pages/dashboard/Dashboard.tsx'
import { Route,Routes } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute.tsx'
function App() {
 
  return (
    <>
    <Routes>
    <Route path="/login" Component={Login}/>
    <Route path="/signup" Component={Register}/> 
    <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        {/* <Route path="/workspaces" element={<WorkspaceList />} />
        <Route path="/projects" element={<ProjectList />} />
        <Route path="/tasks" element={<TaskList />} /> */}
    </Route>
    </Routes>
    </>
  )
}

export default App
