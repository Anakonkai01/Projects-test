import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getUsers,
  updateUser,
  deleteUser,
} from "../../features/admin/adminSlice";
import { toast } from "sonner";
import Pagination from "../Common/Pagination";

const UserManagement = () => {
  const dispatch = useDispatch();
  const { users, pagination, isLoading } = useSelector((state) => state.admin);
  const [currentPage, setCurrentPage] = useState(1);
  
  useEffect(() => {
    dispatch(getUsers(`?page=${currentPage}`));
  }, [dispatch, currentPage]);

  const handleRoleChange = (userId, newRole) => {
    dispatch(updateUser({ id: userId, userData: { role: newRole } }))
      .unwrap()
      .then(() => toast.success("Cập nhật vai trò thành công!"))
      .catch(() => toast.error("Có lỗi xảy ra."));
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm("Bạn có chắc muốn xóa người dùng này?")) {
      dispatch(deleteUser(userId))
        .unwrap()
        .then(() => toast.success("Xóa người dùng thành công!"))
        .catch(() => toast.error("Có lỗi xảy ra."));
    }
  };

  if (isLoading) return <p>Loading users...</p>;
  
  // Debug: Log để kiểm tra
  console.log('Users data:', users);
  console.log('Pagination:', pagination);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">User Management</h2>
      
      {!users || users.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded">
          <p>Không có người dùng nào trong hệ thống.</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto shadow-md sm:rounded-lg bg-white">
            <table className="min-w-full text-left text-sm text-gray-500">
              <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                <tr>
                  <th className="py-3 px-6">User ID</th>
                  <th className="py-3 px-6">Name</th>
                  <th className="py-3 px-6">Email</th>
                  {/* <th className="py-3 px-6">Role</th> */}
                  <th className="py-3 px-6">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-6 font-medium text-gray-900">
                      {user._id}
                    </td>
                    <td className="py-4 px-6">{user.name}</td>
                    <td className="py-4 px-6">{user.email}</td>
                    {/* <td className="py-4 px-6">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user._id, e.target.value)}
                        className="p-2 border rounded"
                      >
                        <option value="USER">USER</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </td> */}
                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            currentPage={pagination?.currentPage || 1}
            totalPages={pagination?.totalPages || 1}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </>
      )}
    </div>
  );
};

export default UserManagement;
