import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { FaPlus, FaTrash } from 'react-icons/fa';
import {
    createAdminProduct,
    updateAdminProduct,
    getAdminProductById,
    resetProduct,
} from '../../features/admin/adminProductSlice';
import adminProductService from '../../features/admin/adminProductService';

const ProductForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { product: currentProduct, isLoading, isError, message } = useSelector(state => state.adminProducts);
    
    // State cho danh mục, giữ nguyên cách fetch của bạn
    const [categories, setCategories] = useState([]);

    // Khởi tạo state ban đầu phức tạp hơn
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: 0,
        brand: '',
        category: '',
        variants: [
            { name: '', sku: '', stock: 0, price: 0 },
            { name: '', sku: '', stock: 0, price: 0 }
        ],
        images: [
            { public_id: '', url: '' },
            { public_id: '', url: '' },
            { public_id: '', url: '' }
        ],
        specifications: { display: '', processor: '', ram: '', storage: '', graphics: '', battery: '' }
    });

    const isEditMode = Boolean(id);

    // useEffect để fetch dữ liệu cần thiết
    useEffect(() => {
        // Fetch categories
        const fetchCategories = async () => {
            try {
                const fetchedCategories = await adminProductService.getCategories();
                setCategories(fetchedCategories);
            } catch (error) {
                toast.error('Không thể tải danh sách danh mục');
            }
        };
        fetchCategories();

        // Fetch sản phẩm nếu ở chế độ edit
        if (isEditMode) {
            dispatch(getAdminProductById(id));
        }
        
        // Cleanup function
        return () => {
            dispatch(resetProduct());
        }
    }, [id, isEditMode, dispatch]);

    // useEffect để điền dữ liệu vào form khi ở chế độ edit
    useEffect(() => {
        if (isEditMode && currentProduct) {
            const imagesData = [...(currentProduct.images || [])];
            while (imagesData.length < 3) {
                imagesData.push({ public_id: '', url: '' });
            }

            setFormData({
                name: currentProduct.name || '',
                description: currentProduct.description || '',
                price: currentProduct.price || 0,
                brand: currentProduct.brand || '',
                category: currentProduct.category?._id || currentProduct.category || '',
                variants: currentProduct.variants.length > 0 ? currentProduct.variants : [{ name: '', sku: '', stock: 0, price: 0 }],
                images: imagesData,
                specifications: currentProduct.specifications || { display: '', processor: '', ram: '', storage: '', graphics: '', battery: '' }
            });
        }
    }, [currentProduct, isEditMode]);
    
    // useEffect để xử lý lỗi
    useEffect(() => {
        if (isError) {
            toast.error(message);
        }
    }, [isError, message]);

    // === CÁC HÀM XỬ LÝ THAY ĐỔI INPUT ===

    const handleChange = e => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSpecificationChange = e => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            specifications: { ...prev.specifications, [name]: value }
        }));
    };
    
    const handleVariantChange = (index, e) => {
        const { name, value } = e.target;
        const updatedVariants = [...formData.variants];
        updatedVariants[index] = { ...updatedVariants[index], [name]: value };
        setFormData(prev => ({ ...prev, variants: updatedVariants }));
    };

    const addVariant = () => {
        setFormData(prev => ({
            ...prev,
            variants: [...prev.variants, { name: '', sku: '', stock: 0, price: 0 }]
        }));
    };

    const removeVariant = (index) => {
        if (formData.variants.length <= 2) {
            toast.error('Sản phẩm phải có ít nhất 2 biến thể.');
            return;
        }
        const updatedVariants = formData.variants.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, variants: updatedVariants }));
    };

    const handleImageChange = (index, e) => {
        const { name, value } = e.target;
        const updatedImages = [...formData.images];
        updatedImages[index] = { ...updatedImages[index], [name]: value };
        setFormData(prev => ({ ...prev, images: updatedImages }));
    };

    // Hàm submit form
    const handleSubmit = (e) => {
        e.preventDefault();
        const action = isEditMode 
            ? updateAdminProduct({ id, productData: formData })
            : createAdminProduct(formData);
            
        dispatch(action).unwrap()
            .then(() => {
                toast.success(`Sản phẩm đã được ${isEditMode ? 'cập nhật' : 'tạo'} thành công!`);
                navigate('/admin/products');
            })
            .catch(err => {
                // Lỗi đã được xử lý bằng useEffect
            });
    };

    // === PHẦN GIAO DIỆN (JSX) ===

    return (
        <>
            <style>{`.input-style { display: block; width: 100%; padding: 0.5rem 0.75rem; border: 1px solid #D1D5DB; border-radius: 0.375rem; box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05); } .input-style:focus { outline: none; border-color: #4F46E5; box-shadow: 0 0 0 1px #4F46E5; }`}</style>
            <div className="p-6">
                <h2 className="text-2xl font-bold mb-6">{isEditMode ? 'Chỉnh sửa sản phẩm' : 'Tạo sản phẩm mới'}</h2>
                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md space-y-8">
                    
                    <fieldset className="border p-4 rounded-md">
                        <legend className="text-lg font-semibold px-2">Thông tin cơ bản</legend>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Tên sản phẩm</label>
                                <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full input-style" required/>
                            </div>
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Mô tả</label>
                                <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows="4" className="mt-1 block w-full input-style" required></textarea>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">Giá gốc</label>
                                    <input type="number" name="price" id="price" value={formData.price} onChange={handleChange} className="mt-1 block w-full input-style" required/>
                                </div>
                                <div>
                                    <label htmlFor="brand" className="block text-sm font-medium text-gray-700">Thương hiệu</label>
                                    <input type="text" name="brand" id="brand" value={formData.brand} onChange={handleChange} className="mt-1 block w-full input-style" required/>
                                </div>
                                <div>
                                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">Danh mục</label>
                                    <select name="category" id="category" value={formData.category} onChange={handleChange} className="mt-1 block w-full input-style" required >
                                        <option value="">-- Chọn danh mục --</option>
                                        {categories.map(cat => (<option key={cat._id} value={cat._id}>{cat.name}</option>))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </fieldset>

                    <fieldset className="border p-4 rounded-md">
                        <legend className="text-lg font-semibold px-2">Biến thể sản phẩm</legend>
                        <div className="space-y-4">
                            {formData.variants.map((variant, index) => (
                                <div key={index} className="grid grid-cols-1 md:grid-cols-10 gap-4 items-center p-2 border-b">
                                    <input type="text" name="name" placeholder="Tên biến thể (VD: Xám, 256GB)" value={variant.name} onChange={e => handleVariantChange(index, e)} className="col-span-4 input-style" required />
                                    <input type="text" name="sku" placeholder="SKU" value={variant.sku} onChange={e => handleVariantChange(index, e)} className="col-span-2 input-style" required />
                                    <input type="number" name="stock" placeholder="Tồn kho" value={variant.stock} onChange={e => handleVariantChange(index, e)} className="col-span-2 input-style" required />
                                    <input type="number" name="price" placeholder="Giá biến thể" value={variant.price} onChange={e => handleVariantChange(index, e)} className="col-span-1 input-style" required />
                                    <button type="button" onClick={() => removeVariant(index)} className="text-red-500 hover:text-red-700 justify-self-center"> <FaTrash /> </button>
                                </div>
                            ))}
                        </div>
                        <button type="button" onClick={addVariant} className="mt-4 flex items-center text-sm text-blue-600 hover:text-blue-800">
                            <FaPlus className="mr-2" /> Thêm biến thể
                        </button>
                    </fieldset>

                    <fieldset className="border p-4 rounded-md">
                        <legend className="text-lg font-semibold px-2">Hình ảnh</legend>
                        <p className="text-sm text-gray-500 mb-4">Cần ít nhất 3 ảnh. Tạm thời nhập URL. Chức năng upload sẽ được thêm sau.</p>
                        <div className="space-y-4">
                            {formData.images.map((image, index) => (
                                <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                                    <input type="text" name="public_id" placeholder="Public ID (tạm thời)" value={image.public_id} onChange={e => handleImageChange(index, e)} className="col-span-1 input-style" required/>
                                    <input type="url" name="url" placeholder="URL hình ảnh" value={image.url} onChange={e => handleImageChange(index, e)} className="col-span-4 input-style" required/>
                                </div>
                            ))}
                        </div>
                    </fieldset>

                     <fieldset className="border p-4 rounded-md">
                        <legend className="text-lg font-semibold px-2">Thông số kỹ thuật</legend>
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <input type="text" name="display" placeholder="Màn hình" value={formData.specifications.display} onChange={handleSpecificationChange} className="input-style" />
                            <input type="text" name="processor" placeholder="Vi xử lý (CPU)" value={formData.specifications.processor} onChange={handleSpecificationChange} className="input-style" />
                            <input type="text" name="ram" placeholder="RAM" value={formData.specifications.ram} onChange={handleSpecificationChange} className="input-style" />
                            <input type="text" name="storage" placeholder="Bộ nhớ trong" value={formData.specifications.storage} onChange={handleSpecificationChange} className="input-style" />
                            <input type="text" name="graphics" placeholder="Card đồ họa" value={formData.specifications.graphics} onChange={handleSpecificationChange} className="input-style" />
                            <input type="text" name="battery" placeholder="Pin" value={formData.specifications.battery} onChange={handleSpecificationChange} className="input-style" />
                        </div>
                    </fieldset>

                    <div className="flex justify-end space-x-4 pt-4">
                         <button type="button" onClick={() => navigate('/admin/products')} className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300">Hủy</button>
                        <button type="submit" disabled={isLoading} className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-300">
                            {isLoading ? 'Đang lưu...' : (isEditMode ? 'Cập nhật' : 'Tạo mới')}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default ProductForm;