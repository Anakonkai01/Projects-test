// Nhan/frontend/src/components/Admin/AdminLayout.jsx
import React, { useState } from "react";
import { FaBars } from "react-icons/fa"; 
import { Outlet, Link, useNavigate } from "react-router-dom"; // <-- Thêm useNavigate
import { useDispatch } from 'react-redux'; // <-- Thêm useDispatch
import { logout, reset } from '../../features/auth/authSlice'; // <-- Thêm actions
import { HiOutlineLogout } from 'react-icons/hi'; // <-- Thêm icon

// Sửa lại Sidebar để nhận hàm onLogout
const AdminSidebar = ({ onLogout }) => (
    // Thêm flex flex-col h-full để đẩy nút logout xuống dưới
    <div className="p-4 flex flex-col h-full">
        <div>
            <h1 className="text-2xl font-bold mb-8">Admin</h1>
            <nav className="space-y-4">
                <Link to="/admin" className="block text-gray-300 hover:text-white p-2 rounded-md transition-colors">Dashboard</Link>
                <Link to="/admin/users" className="block text-gray-300 hover:text-white p-2 rounded-md transition-colors">Quản lý Users</Link>
                <Link to="/admin/products" className="block text-gray-300 hover:text-white p-2 rounded-md transition-colors">Quản lý Products</Link>
                <Link to="/admin/orders" className="block text-gray-300 hover:text-white p-2 rounded-md transition-colors">Quản lý Orders</Link>
                <Link to="/admin/discounts" className="block text-gray-300 hover:text-white p-2 rounded-md transition-colors">Quản lý Discounts</Link>
            </nav>
        </div>

        {/* THÊM NÚT LOGOUT Ở ĐÂY */}
        <div className="mt-auto">
            <button 
                onClick={onLogout}
                className="w-full flex items-center text-red-400 hover:bg-red-700 hover:text-white p-3 rounded-lg transition-colors font-medium"
            >
                <HiOutlineLogout className="w-6 h-6 mr-3" />
                Đăng xuất
            </button>
        </div>
    </div>
);

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/'); 
    if (isSidebarOpen) {
        toggleSidebar();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 md:flex-row relative">
      <div className="flex md:hidden p-4 bg-gray-900 text-white z-20">
        <button onClick={toggleSidebar}><FaBars size={24} /></button>
        <h1 className="ml-4 text-xl font-medium">Admin Dashboard</h1>
      </div>
      {isSidebarOpen && <div className="fixed inset-0 bg-black opacity-50 z-10 md:hidden" onClick={toggleSidebar}></div>}

      <aside className={`bg-gray-900 w-64 min-h-screen text-white fixed md:relative transform 
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        transition-transform duration-300 ease-in-out z-20 md:translate-x-0`}>
        
        {/* SỬA: Truyền hàm handleLogout vào Sidebar */}
        <AdminSidebar onLogout={handleLogout} />
      </aside>

      <main className="flex-grow p-6 overflow-auto">
          <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;