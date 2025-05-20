import { useEffect, useState } from "react";
import { useIsBlocked } from "../../hooks/endpoints";

const UserRow = ({
  user,
  onDelete,
  blockUser,
  unblockUser,
  loadingDelete,
  loadingBlock,
  loadingUnblock,
}) => {
  const [isBlocked, setIsBlocked] = useState(false);
  const { data, loading, refetch } = useIsBlocked(user.id, true);

  useEffect(() => {
    if (data != null && data.status) {
      setIsBlocked(data.data.data.is_blocked);
    }
  }, [data]);

  const toggleBlock = async () => {
    isBlocked ? await unblockUser(user.id) : await blockUser(user.id);
    refetch();
  };

  return (
    <tr className="border-b">
      <td className="px-6 py-4">{user.name}</td>
      <td className="px-6 py-4">{user.email}</td>
      <td className="px-6 py-4">{user.role}</td>
      <td className="px-6 py-4">{user.balance}</td>
      <td className="px-6 py-4 space-x-2">
        <button
          onClick={() => onDelete(user.id)}
          disabled={loadingDelete}
          className="px-3 py-1 rounded bg-gray-700 text-white"
        >
          Delete
        </button>
        <button
          onClick={toggleBlock}
          disabled={loadingBlock || loadingUnblock || loading}
          className={`px-3 py-1 rounded text-white ${
            isBlocked ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {isBlocked ? "Unblock" : "Block"}
        </button>
      </td>
    </tr>
  );
};

export default UserRow;
