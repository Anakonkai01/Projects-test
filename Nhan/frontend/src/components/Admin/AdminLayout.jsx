import React, { useState } from "react";
import { FaBars } from "react-icons/fa"; 
import { Outlet, Link } from "react-router-dom";

const AdminSidebar = () => (
    <div className="p-4">
        <h1 className="text-2xl font-bold mb-8">Admin</h1>
        <nav className="space-y-4">
            <Link to="/admin" className="block text-gray-300 hover:text-white">Dashboard</Link>
            <Link to="/admin/users" className="block text-gray-300 hover:text-white">Quản lý Users</Link>
            <Link to="/admin/products" className="block text-gray-300 hover:text-white">Quản lý Products</Link>
            <Link to="/admin/orders" className="block text-gray-300 hover:text-white">Quản lý Orders</Link>
            <Link to="/admin/discounts" className="block text-gray-300 hover:text-white">Quản lý Discounts</Link>
        </nav>
    </div>
);

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

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
        <AdminSidebar />
      </aside>

      <main className="flex-grow p-6 overflow-auto">
          <Outlet /> {/* Nội dung của các trang con sẽ được hiển thị ở đây */}
      </main>
    </div>
  );
};

export default AdminLayout;