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
        
        // Validate all fields are filled
        if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmNewPassword) {
            return toast.error("Vui lòng điền đầy đủ tất cả các trường!");
        }
        
        // Validate new password length
        if (passwordData.newPassword.length < 8) {
            return toast.error("Mật khẩu mới phải có ít nhất 8 ký tự!");
        }
        
        // Validate passwords match
        if (passwordData.newPassword !== passwordData.confirmNewPassword) {
            return toast.error("Mật khẩu mới không khớp!");
        }
        
        // Don't send confirmNewPassword to backend
        const { confirmNewPassword, ...dataToSend } = passwordData;
        
        dispatch(updatePassword(dataToSend))
            .unwrap()
            .then(() => {
                toast.success("Đổi mật khẩu thành công!");
                setPasswordData({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
                dispatch(reset());
            })
            .catch((err) => {
                console.error('Password update error:', err);
                toast.error(err || "Đã có lỗi xảy ra khi đổi mật khẩu");
            });
    };

    return (
        <div className="space-y-6">
            {/* Form cập nhật thông tin */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4">Thông tin cá nhân</h3>
                
                {/* Thông báo tài khoản Google */}
                {user?.googleId && (
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-blue-700">
                                    <strong>Tài khoản Google:</strong> Email của bạn được quản lý bởi Google và không thể thay đổi tại đây. 
                                    Bạn chỉ có thể cập nhật tên hiển thị.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
                
                <form onSubmit={handleInfoSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">
                            Tên <span className="text-red-500">*</span>
                        </label>
                        <input 
                            type="text" 
                            id="name" 
                            name="name" 
                            value={infoData.name} 
                            onChange={handleInfoChange} 
                            placeholder="Nhập tên của bạn"
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                            Email {!user?.googleId && <span className="text-red-500">*</span>}
                            {user?.googleId && <span className="text-gray-500 text-xs ml-2">(Không thể thay đổi)</span>}
                        </label>
                        <input 
                            type="email" 
                            id="email" 
                            name="email" 
                            value={infoData.email} 
                            onChange={handleInfoChange} 
                            placeholder="your-email@example.com"
                            className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${user?.googleId ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                            disabled={user?.googleId}
                            readOnly={user?.googleId}
                            required={!user?.googleId}
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed" 
                        disabled={isLoading}
                    >
                        {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
                    </button>
                </form>
            </div>

            {/* Form đổi mật khẩu - Chỉ hiển thị cho tài khoản không phải Google */}
            {!user?.googleId && (
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-4">Đổi mật khẩu</h3>
                    
                    <form onSubmit={handlePasswordSubmit} className="space-y-4" autoComplete="off">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="currentPassword">
                                Mật khẩu hiện tại <span className="text-red-500">*</span>
                            </label>
                            <input 
                                type="password" 
                                id="currentPassword" 
                                name="currentPassword" 
                                value={passwordData.currentPassword} 
                                onChange={handlePasswordChange} 
                                placeholder="Nhập mật khẩu hiện tại"
                                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                autoComplete="current-password"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="newPassword">
                                Mật khẩu mới <span className="text-red-500">*</span>
                            </label>
                            <input 
                                type="password" 
                                id="newPassword" 
                                name="newPassword" 
                                value={passwordData.newPassword} 
                                onChange={handlePasswordChange} 
                                placeholder="Ít nhất 8 ký tự"
                                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                autoComplete="new-password"
                                minLength="8"
                                required
                            />
                            {passwordData.newPassword && passwordData.newPassword.length < 8 && (
                                <p className="text-red-500 text-xs mt-1">Mật khẩu phải có ít nhất 8 ký tự</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="confirmNewPassword">
                                Xác nhận mật khẩu mới <span className="text-red-500">*</span>
                            </label>
                            <input 
                                type="password" 
                                id="confirmNewPassword" 
                                name="confirmNewPassword" 
                                value={passwordData.confirmNewPassword} 
                                onChange={handlePasswordChange} 
                                placeholder="Nhập lại mật khẩu mới"
                                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                autoComplete="new-password"
                                required
                            />
                            {passwordData.confirmNewPassword && passwordData.newPassword !== passwordData.confirmNewPassword && (
                                <p className="text-red-500 text-xs mt-1">Mật khẩu không khớp</p>
                            )}
                        </div>
                        <button 
                            type="submit" 
                            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed" 
                            disabled={isLoading}
                        >
                            {isLoading ? "Đang đổi..." : "Đổi mật khẩu"}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ProfileSettings;