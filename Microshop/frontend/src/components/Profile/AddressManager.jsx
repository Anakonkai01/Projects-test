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
        address: '', city: '', phoneNo: '', postalCode: '', country: '', isDefault: false
    });

    const handleInputChange = e => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleAddNew = () => {
        setEditingAddress(null);
        setFormData({ address: '', city: '', phoneNo: '', postalCode: '', country: '', isDefault: false });
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
        const action = editingAddress
            ? updateAddress({ addressId: editingAddress._id, addressData: formData })
            : addAddress(formData);

        dispatch(action).unwrap()
            .then(() => {
                toast.success(editingAddress ? 'Cập nhật thành công!' : 'Thêm địa chỉ thành công!');
                setIsFormOpen(false);
                dispatch(reset());
            })
            .catch(err => toast.error('Đã có lỗi xảy ra.'));
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mt-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Sổ địa chỉ</h3>
                <button onClick={handleAddNew} className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">Thêm địa chỉ mới</button>
            </div>

            {isFormOpen && (
                <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded-lg">
                    {/* Input fields for address, city, etc. */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input name="address" value={formData.address} onChange={handleInputChange} placeholder="Địa chỉ" className="p-2 border rounded" required />
                        <input name="city" value={formData.city} onChange={handleInputChange} placeholder="Thành phố" className="p-2 border rounded" required />
                        <input name="phoneNo" value={formData.phoneNo} onChange={handleInputChange} placeholder="Số điện thoại" className="p-2 border rounded" required />
                        <input name="postalCode" value={formData.postalCode} onChange={handleInputChange} placeholder="Mã bưu chính" className="p-2 border rounded" required />
                        <input name="country" value={formData.country} onChange={handleInputChange} placeholder="Quốc gia" className="p-2 border rounded" required />
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
                            <p>{`${addr.city}, ${addr.country}, ${addr.postalCode}`}</p>
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