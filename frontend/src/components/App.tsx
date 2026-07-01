import '../App.css'
import Login from '../pages/auth/Login.tsx'
import Dashboard from '../pages/dashboard/Dashboard.tsx'
import { Route,Routes } from 'react-router-dom'
function App() {
  return (
    <>
    <Routes>
    <Route path="/login" Component={Login}/>
     <Route path="/dashboard" Component={Dashboard} />
    </Routes>
    </>
  )
}

export default App
