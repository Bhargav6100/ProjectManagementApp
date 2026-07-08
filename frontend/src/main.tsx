import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom'
import './index.css'
import App from './components/App.tsx'
import { AuthProvider } from './context/AuthContext.tsx'
import {UsersProvider} from './context/UsersContext.tsx'
import { WorkspaceProvider } from './context/WorkspaceContext.tsx'
import { ProjectProvider } from './context/ProjectContext.tsx'
import { TaskProvider } from './context/TaskContext.tsx'
import { SnackbarProvider } from './context/SnackbarContext.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
  <SnackbarProvider>
  <AuthProvider>
  <UsersProvider>
  <WorkspaceProvider>
  <ProjectProvider>
  <TaskProvider>
  <StrictMode>
  <App />
  </StrictMode>,
  </TaskProvider>
  </ProjectProvider>  
  </WorkspaceProvider>
  </UsersProvider>
  </AuthProvider>
  </SnackbarProvider>
  </BrowserRouter>
)
