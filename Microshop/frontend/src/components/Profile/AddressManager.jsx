import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { addAddress, updateAddress, deleteAddress, reset } from '../../features/auth/authSlice';

const AddressManager = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [formData, setFormData] = useState({
        address: '', city: '', phoneNo: '', postalCode: '', isDefault: false
    });

    const handleInputChange = e => {
        const { name, value, type, checked } = e.target;
        
        // Validate phone number (chỉ cho phép số)
        if (name === "phoneNo") {
            const phoneRegex = /^[0-9]*$/;
            if (!phoneRegex.test(value)) {
                return;
            }
        }
        
        // Validate postal code (chỉ cho phép số)
        if (name === "postalCode") {
            const postalRegex = /^[0-9]*$/;
            if (!postalRegex.test(value)) {
                return;
            }
        }
        
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleAddNew = () => {
        setEditingAddress(null);
        setFormData({ address: '', city: '', phoneNo: '', postalCode: '', isDefault: false });
        setIsFormOpen(true);
    };

    const handleEdit = (addr) => {
        setEditingAddress(addr);
        setFormData(addr);
        setIsFormOpen(true);
    };

    const handleDelete = (addressId) => {
        if (window.confirm('Bạn có chắc muốn xóa địa chỉ này?')) {
            dispatch(deleteAddress(addressId)).unwrap().then(() => toast.success('Xóa địa chỉ thành công!'));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validate phone number length
        if (formData.phoneNo.length < 10 || formData.phoneNo.length > 11) {
            toast.error("Số điện thoại phải có 10-11 chữ số.");
            return;
        }
        
        // Validate postal code length
        if (formData.postalCode.length < 5 || formData.postalCode.length > 6) {
            toast.error("Mã bưu chính phải có 5-6 chữ số.");
            return;
        }
        
        const action = editingAddress
            ? updateAddress({ addressId: editingAddress._id, addressData: formData })
            : addAddress(formData);

        dispatch(action).unwrap()
            .then(() => {
                toast.success(editingAddress ? 'Cập nhật thành công!' : 'Thêm địa chỉ thành công!');
                setIsFormOpen(false);
                setFormData({ address: '', city: '', phoneNo: '', postalCode: '', isDefault: false });
            })
            .catch(err => {
                console.error('Address error:', err);
                toast.error(err || 'Đã có lỗi xảy ra.');
            });
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mt-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Sổ địa chỉ</h3>
                <button onClick={handleAddNew} className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">Thêm địa chỉ mới</button>
            </div>

            {isFormOpen && (
                <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded-lg">
                    <h4 className="text-lg font-semibold mb-4">{editingAddress ? 'Sửa địa chỉ' : 'Thêm địa chỉ mới'}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                                Địa chỉ <span className="text-red-500">*</span>
                            </label>
                            <input 
                                id="address"
                                name="address" 
                                value={formData.address} 
                                onChange={handleInputChange} 
                                placeholder="VD: 123 Đường ABC, Phường XYZ" 
                                className="p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                required 
                            />
                        </div>
                        <div>
                            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                                Thành phố <span className="text-red-500">*</span>
                            </label>
                            <input 
                                id="city"
                                name="city" 
                                value={formData.city} 
                                onChange={handleInputChange} 
                                placeholder="VD: Hồ Chí Minh" 
                                className="p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                required 
                            />
                        </div>
                        <div>
                            <label htmlFor="phoneNo" className="block text-sm font-medium text-gray-700 mb-1">
                                Số điện thoại <span className="text-red-500">*</span>
                            </label>
                            <input 
                                id="phoneNo"
                                name="phoneNo" 
                                type="tel"
                                value={formData.phoneNo} 
                                onChange={handleInputChange} 
                                placeholder="VD: 0901234567 (10-11 số)" 
                                className="p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                maxLength="11"
                                required 
                            />
                        </div>
                        <div>
                            <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                                Mã bưu chính <span className="text-red-500">*</span>
                            </label>
                            <input 
                                id="postalCode"
                                name="postalCode" 
                                type="text"
                                value={formData.postalCode} 
                                onChange={handleInputChange} 
                                placeholder="VD: 70000 (5-6 số)" 
                                className="p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                maxLength="6"
                                required 
                            />
                        </div>
                    </div>
                    <div className="mt-4">
                        <label className="flex items-center">
                            <input type="checkbox" name="isDefault" checked={formData.isDefault} onChange={handleInputChange} className="mr-2" />
                            Đặt làm địa chỉ mặc định
                        </label>
                    </div>
                    <div className="mt-4">
                        <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">Lưu</button>
                        <button type="button" onClick={() => setIsFormOpen(false)} className="ml-2 text-gray-600">Hủy</button>
                    </div>
                </form>
            )}

            <div className="space-y-4">
                {user?.addresses?.map(addr => (
                    <div key={addr._id} className="p-4 border rounded-lg flex justify-between items-start">
                        <div>
                            <p className="font-bold">{addr.address} {addr.isDefault && <span className="text-xs bg-green-200 text-green-800 p-1 rounded-full ml-2">Mặc định</span>}</p>
                            <p>{`${addr.city}, ${addr.postalCode}`}</p>
                            <p>SĐT: {addr.phoneNo}</p>
                        </div>
                        <div className="flex space-x-2">
                            <button onClick={() => handleEdit(addr)} className="text-blue-500">Sửa</button>
                            <button onClick={() => handleDelete(addr._id)} className="text-red-500">Xóa</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AddressManager;