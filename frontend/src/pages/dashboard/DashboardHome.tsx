import { useAuth } from "../../context/AuthContext";

import DashboardContents from "../../components/adminComponents/DashboardContents";
import PMDashboardContents from "../../components/pmComponents/PMDashboardContents";
import MemberDashboardContents from "../../components/memberComponents/MemberDashboardContents";

export default function DashboardHome(): React.JSX.Element {
  const { user } = useAuth();

  if (user?.role === "ADMIN") {
    return <DashboardContents />;
  }

  if (user?.role === "PROJECT_MANAGER") {
    return <PMDashboardContents />;
  }

  if (user?.role === "MEMBER") {
    return <MemberDashboardContents />;
  }

  return <div>Unauthorized role</div>;
}