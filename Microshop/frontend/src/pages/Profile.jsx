// E_com/FE/src/pages/Profile.jsx
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import ProfileSettings from "../components/Profile/ProfileSettings";
import AddressManager from '../components/Profile/AddressManager';
import OrderHistory from '../components/Profile/OrderHistory';
import { getMe } from "../features/auth/authSlice"; // <-- Thêm import

const Profile = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch(); // <-- Khởi tạo dispatch
    const { user } = useSelector((state) => state.auth);
    const [activeTab, setActiveTab] = useState('settings');

    // Luôn lấy thông tin user mới nhất (bao gồm cả điểm) khi vào trang
    useEffect(() => {
        if (user) {
            dispatch(getMe());
        } else {
            navigate('/login');
        }
    }, [dispatch, navigate]); // Bỏ user khỏi dependency array để tránh gọi lại không cần thiết

    if (!user) {
        // Hiển thị loading hoặc null trong khi chờ user state
        return <div>Loading...</div>; 
    }

    const renderContent = () => {
        switch (activeTab) {
            case 'orders':
                return <OrderHistory />;
            case 'addresses':
                return <AddressManager />;
            case 'settings':
            default:
                return <ProfileSettings />;
        }
    };

    const TabButton = ({ tabName, label }) => (
        <button
            onClick={() => setActiveTab(tabName)}
            className={`w-full text-left px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === tabName
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
            }`}
        >
            {label}
        </button>
    );

    return (
        <div className="container mx-auto p-4 md:p-6 min-h-screen bg-gray-50">
            <div className="flex flex-col md:flex-row md:space-x-8">
                {/* Cột trái: Menu */}
                <aside className="w-full md:w-1/4 bg-white p-6 rounded-lg shadow-md h-fit">
                    <div className="text-center mb-6">
                        <h2 className="text-xl font-bold">{user.name}</h2>
                        <p className="text-gray-500 text-sm">{user.email}</p>
                        
                        {/* === PHẦN ĐÃ HOÀN THIỆN === */}
                        <div className="mt-4 bg-green-100 text-green-800 text-sm font-semibold px-3 py-1.5 rounded-full inline-block">
                           Điểm thưởng: {user.loyaltyPoints || 0}
                        </div>
                    </div>
                    <nav className="flex flex-col space-y-2">
                        <TabButton tabName="settings" label="Cài đặt tài khoản" />
                        <TabButton tabName="addresses" label="Sổ địa chỉ" />
                        <TabButton tabName="orders" label="Lịch sử đơn hàng" />
                    </nav>
                </aside>

                {/* Cột phải: Nội dung */}
                <main className="w-full md:w-3/4 mt-6 md:mt-0">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default Profile;