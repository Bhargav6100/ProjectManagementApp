import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom'
import './index.css'
import App from './components/App.tsx'
import { AuthProvider } from './context/AuthContext.tsx'
import {UsersProvider} from './context/UsersContext.tsx'
import { WorkspaceProvider } from './context/WorkspaceContext.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
  <AuthProvider>
  <UsersProvider>
  <WorkspaceProvider>
  <StrictMode>
  <App />
  </StrictMode>,
  </WorkspaceProvider>
  </UsersProvider>
  </AuthProvider>
  </BrowserRouter>
)
