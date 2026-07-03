import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AdminPanel from "./AdminPanel";
import ProjectManagerPanel from "./ProjectManagerPanel";
// import MemberPanel from "./MemberPanel";

export default function Dashboard(): React.JSX.Element {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  if (user.role === "ADMIN") {
    return <AdminPanel />;
  }

  if (user.role === "PROJECT_MANAGER") {
    return <ProjectManagerPanel/>;
  
  }

  // if (user.role === "MEMBER") {
  //   return <div>Member Panel</div>;
  //   // later: return <MemberPanel />;
  // }

  return <div>Unauthorized role</div>;
}

