import AdminUsersList from "../admin/AdminUsersList";
import useCurrentUser from "../../hooks/useCurrentUser";
import AdminCategories from "../admin/AdminCategories";
import ClientDashbord from "../client/clientDashbord";

const Dashboard = () => {
  const { user, loading, error } = useCurrentUser();

  if (loading) return <div>Loading user...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="min-h-screen bg-white text-gray-900 p-4 sm:p-6 md:p-8 mt-24">
      {user.role === "admin" ? (
        <>
          <AdminCategories />
          <AdminUsersList />
        </>
      ) : (
        <ClientDashbord />
      )}
    </div>
  );
};

export default Dashboard;
