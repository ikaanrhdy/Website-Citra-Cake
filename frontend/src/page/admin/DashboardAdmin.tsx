import useAuthStore from "@/app/store/auth";
import DashboardOwner from "./DashboardOwner";
import DashboardAdminToko from "./DashboardAdminToko";

const DashboardAdmin = () => {
  const { name, role } = useAuthStore();

  if (role === "owner") return <DashboardOwner name={name} />;
  return <DashboardAdminToko name={name} />;
};

export default DashboardAdmin;
