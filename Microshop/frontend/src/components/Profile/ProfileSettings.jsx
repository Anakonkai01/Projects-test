// E_com/FE/src/components/Profile/ProfileSettings.jsx

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { updateDetails, updatePassword, reset } from '../../features/auth/authSlice';

const ProfileSettings = () => {
    const dispatch = useDispatch();
    const { user, isLoading } = useSelector((state) => state.auth);

    const [infoData, setInfoData] = useState({ name: '', email: '' });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '', newPassword: '', confirmNewPassword: ''
    });
    
    useEffect(() => {
        if (user) {
            setInfoData({ name: user.name, email: user.email });
        }
    }, [user]);

    const handleInfoChange = (e) => setInfoData({ ...infoData, [e.target.name]: e.target.value });
    const handlePasswordChange = (e) => setPasswordData({ ...passwordData, [e.target.name]: e.target.value });

    const handleInfoSubmit = (e) => {
        e.preventDefault();
        dispatch(updateDetails(infoData))
            .unwrap()
            .then(() => {
                toast.success("Cập nhật thông tin thành công!");
                dispatch(reset());
            })
            .catch((err) => toast.error(err || "Đã có lỗi xảy ra"));
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmNewPassword) {
            return toast.error("Mật khẩu mới không khớp!");
        }
        dispatch(updatePassword(passwordData))
            .unwrap()
            .then(() => {
                toast.success("Đổi mật khẩu thành công!");
                setPasswordData({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
                dispatch(reset());
            })
            .catch((err) => toast.error(err || "Đã có lỗi xảy ra"));
    };

    return (
        <div className="space-y-6">
            {/* Form cập nhật thông tin */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4">Thông tin cá nhân</h3>
                <form onSubmit={handleInfoSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 mb-2" htmlFor="name">Tên</label>
                        <input type="text" id="name" name="name" value={infoData.name} onChange={handleInfoChange} className="w-full px-3 py-2 border rounded" />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" value={infoData.email} onChange={handleInfoChange} className="w-full px-3 py-2 border rounded" />
                    </div>
                    <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700" disabled={isLoading}>
                        {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
                    </button>
                </form>
            </div>

            {/* Form đổi mật khẩu */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4">Đổi mật khẩu</h3>
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 mb-2" htmlFor="currentPassword">Mật khẩu hiện tại</label>
                        <input type="password" id="currentPassword" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} className="w-full px-3 py-2 border rounded" />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-2" htmlFor="newPassword">Mật khẩu mới</label>
                        <input type="password" id="newPassword" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} className="w-full px-3 py-2 border rounded" />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-2" htmlFor="confirmNewPassword">Xác nhận mật khẩu mới</label>
                        <input type="password" id="confirmNewPassword" name="confirmNewPassword" value={passwordData.confirmNewPassword} onChange={handlePasswordChange} className="w-full px-3 py-2 border rounded" />
                    </div>
                    <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700" disabled={isLoading}>
                        {isLoading ? "Đang đổi..." : "Đổi mật khẩu"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProfileSettings;