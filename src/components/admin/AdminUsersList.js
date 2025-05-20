import useFetchCollection from "../../hooks/useFetchCollection";
import {
  useBlockUser,
  useUnblockUser,
  useDeleteUser,
} from "../../hooks/endpoints";

import UserRow from "./AdminUserRow";

const AdminUsersList = () => {
  const { data, loading, error, refetch } = useFetchCollection("Users");

  const { blockUser, loading: loadingBlock } = useBlockUser();
  const { unblockUser, loading: loadingUnblock } = useUnblockUser();
  const { deleteUser, loading: loadingDelete } = useDeleteUser();
  // const { isBlockedUser, loadingIsBlock } = useIsBlocked(user.id, true);

  if (loading) return <div>Loading users...</div>;
  if (error) return <div>{error}</div>;

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    const res = await deleteUser(userId);
    if (res.status) {
      refetch();
      alert("User deleted successfully.");
    } else {
      alert(
        "Failed to delete user: " + (res.error?.message || "Unknown error")
      );
    }
  };
  const handleBlock = async (userId) => {
    if (!window.confirm("Are you sure you want to block this user?")) return;
    const res = await blockUser(userId);

    refetch();
  };

  const handleUnBlock = async (userId) => {
    if (!window.confirm("Are you sure you want to unblock this user?")) return;
    const res = await unblockUser(userId);

    if (res.status) {
      refetch();
      alert("User unblocked successfully.");
    } else {
      alert(
        "Failed to unblock user: " + (res.error?.message || "Unknown error")
      );
    }
  };
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">Users</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-100 text-left text-sm uppercase tracking-wider text-gray-700">
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Role</th>
              <th className="px-6 py-3">Balance</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((user) => (
              <UserRow
                key={user.id}
                user={user}
                onDelete={handleDelete}
                blockUser={handleBlock}
                unblockUser={handleUnBlock}
                loadingDelete={loadingDelete}
                loadingBlock={loadingBlock}
                loadingUnblock={loadingUnblock}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsersList;
