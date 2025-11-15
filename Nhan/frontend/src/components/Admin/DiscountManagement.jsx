import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAdminDiscounts, createAdminDiscount, deleteAdminDiscount } from '../../features/admin/adminDiscountSlice';
import { FaPlus, FaTrash } from 'react-icons/fa';

const DiscountManagement = () => {
    const dispatch = useDispatch();
    const { discounts, isLoading } = useSelector(state => state.adminDiscounts);
    const [formData, setFormData] = useState({
        code: '',
        discountType: 'percentage',
        value: 0,
        usageLimit: 1
    });

    useEffect(() => {
        dispatch(getAdminDiscounts());
    }, [dispatch]);

    const handleInputChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = e => {
        e.preventDefault();
        dispatch(createAdminDiscount(formData));
        // Reset form after submission
        setFormData({ code: '', discountType: 'percentage', value: 0, usageLimit: 1 });
    };

    const handleDelete = id => {
        if (window.confirm('Bạn có chắc muốn xóa mã này?')) {
            dispatch(deleteAdminDiscount(id));
        }
    };
    
    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Quản lý Mã Giảm Giá</h2>

            {/* Form tạo mới */}
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8 grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                <div className="md:col-span-1">
                    <label className="block text-sm font-medium">Mã Code (5 ký tự)</label>
                    <input type="text" name="code" value={formData.code} onChange={handleInputChange} className="p-2 border rounded w-full mt-1" maxLength="5" required />
                </div>
                <div className="md:col-span-1">
                    <label className="block text-sm font-medium">Loại</label>
                    <select name="discountType" value={formData.discountType} onChange={handleInputChange} className="p-2 border rounded w-full mt-1">
                        <option value="percentage">Phần trăm (%)</option>
                        <option value="fixed">Số tiền cố định</option>
                    </select>
                </div>
                 <div className="md:col-span-1">
                    <label className="block text-sm font-medium">Giá trị</label>
                    <input type="number" name="value" value={formData.value} onChange={handleInputChange} className="p-2 border rounded w-full mt-1" min="0" required />
                </div>
                <div className="md:col-span-1">
                    <label className="block text-sm font-medium">Lượt sử dụng (tối đa 10)</label>
                    <input type="number" name="usageLimit" value={formData.usageLimit} onChange={handleInputChange} className="p-2 border rounded w-full mt-1" min="1" max="10" required />
                </div>
                <button type="submit" className="bg-green-500 text-white p-2 rounded hover:bg-green-600 flex items-center justify-center h-10 mt-1">
                    <FaPlus className="mr-2" /> Thêm
                </button>
            </form>

            {/* Bảng danh sách */}
            <div className="overflow-x-auto shadow-md sm:rounded-lg bg-white">
                <table className="min-w-full text-left text-sm text-gray-700">
                    <thead className="bg-gray-50 text-xs uppercase">
                        <tr>
                            <th className="py-3 px-6">Mã</th>
                            <th className="py-3 px-6">Giá trị</th>
                            <th className="py-3 px-6">Đã dùng / Giới hạn</th>
                            <th className="py-3 px-6">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr><td colSpan="4" className="text-center p-4">Đang tải...</td></tr>
                        ) : (
                            discounts.map(d => (
                                <tr key={d._id} className="border-b hover:bg-gray-50">
                                    <td className="py-4 px-6 font-medium text-blue-600">{d.code}</td>
                                    <td className="py-4 px-6">{d.discountType === 'percentage' ? `${d.value}%` : `${d.value.toLocaleString('vi-VN')} đ`}</td>
                                    <td className="py-4 px-6">{d.timesUsed} / {d.usageLimit}</td>
                                    <td className="py-4 px-6">
                                        <button onClick={() => handleDelete(d._id)} className="text-red-500 hover:text-red-700">
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DiscountManagement;