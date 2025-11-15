import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { forgotPassword, reset } from '../features/auth/authSlice';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const dispatch = useDispatch();
    const { isLoading } = useSelector((state) => state.auth);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(forgotPassword({ email }))
            .unwrap()
            .then(() => {
                toast.success('Yêu cầu đã được gửi. Vui lòng kiểm tra email của bạn!');
                dispatch(reset());
                setEmail('');
            })
            .catch((err) => toast.error('Đã có lỗi xảy ra.'));
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center mb-6">Quên Mật khẩu</h2>
                <p className="text-gray-600 text-center mb-6">Nhập email của bạn và chúng tôi sẽ gửi cho bạn một liên kết để đặt lại mật khẩu.</p>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 border rounded"
                        required
                    />
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700" disabled={isLoading}>
                    {isLoading ? 'Đang gửi...' : 'Gửi liên kết đặt lại'}
                </button>
            </form>
        </div>
    );
};

export default ForgotPassword;