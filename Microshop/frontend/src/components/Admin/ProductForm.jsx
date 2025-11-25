// Nhan/frontend/src/components/Admin/ProductForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { FaPlus, FaTrash, FaTimes } from 'react-icons/fa';
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
    
    // SỬA: Thêm 'imageIndex' vào state mặc định của variant
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: 0,
        brand: '',
        variants: [
            { name: '', sku: '', stock: 0, price: 0, imageIndex: 0 },
            { name: '', sku: '', stock: 0, price: 0, imageIndex: 0 }
        ],
        specifications: { display: '', processor: '', ram: '', storage: '', graphics: '', battery: '' }
    });
    
    const [existingImages, setExistingImages] = useState([]); 
    const [newImageFiles, setNewImageFiles] = useState([]); 
    const [imagePreviews, setImagePreviews] = useState([]); 

    const isEditMode = Boolean(id);

    useEffect(() => {
        if (isEditMode) {
            dispatch(getAdminProductById(id));
        }
        
        return () => {
            dispatch(resetProduct());
        }
    }, [id, isEditMode, dispatch]);

    // SỬA: Đảm bảo 'imageIndex' được nạp vào form
    useEffect(() => {
        if (isEditMode && currentProduct) {
            setFormData({
                name: currentProduct.name || '',
                description: currentProduct.description || '',
                price: currentProduct.price || 0,
                brand: currentProduct.brand || '',
                // Thêm 'imageIndex' (hoặc mặc định là 0 nếu dữ liệu cũ không có)
                variants: currentProduct.variants.length > 0 
                    ? currentProduct.variants.map(v => ({...v, imageIndex: v.imageIndex || 0})) 
                    : [{ name: '', sku: '', stock: 0, price: 0, imageIndex: 0 }],
                specifications: currentProduct.specifications || { display: '', processor: '', ram: '', storage: '', graphics: '', battery: '' }
            });
            
            setExistingImages(currentProduct.images || []);
            setImagePreviews(currentProduct.images.map(img => img.url) || []);
            setNewImageFiles([]); 
        }
    }, [currentProduct, isEditMode]);
    
    // ... (useEffect isError, handleChange, handleSpecificationChange giữ nguyên) ...
    useEffect(() => {
        if (isError) {
            toast.error(message);
        }
    }, [isError, message]);

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
    
    // handleVariantChange đã đủ chung chung, không cần sửa
    const handleVariantChange = (index, e) => {
        const { name, value } = e.target;
        const updatedVariants = [...formData.variants];
        updatedVariants[index] = { ...updatedVariants[index], [name]: value };
        setFormData(prev => ({ ...prev, variants: updatedVariants }));
    };

    // SỬA: Thêm 'imageIndex: 0' khi thêm variant mới
    const addVariant = () => {
        setFormData(prev => ({
            ...prev,
            variants: [...prev.variants, { name: '', sku: '', stock: 0, price: 0, imageIndex: 0 }]
        }));
    };

    const removeVariant = (index) => {
        // ... (Giữ nguyên logic)
        if (formData.variants.length <= 2) {
            toast.error('Sản phẩm phải có ít nhất 2 biến thể.');
            return;
        }
        const updatedVariants = formData.variants.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, variants: updatedVariants }));
    };

    // ... (Các hàm handleImageFileChange, removeImage, handleSubmit giữ nguyên, chúng đã hoạt động đúng) ...
     const handleImageFileChange = (e) => {
        const files = Array.from(e.target.files);
        const imageFiles = files.filter(file => file.type.startsWith('image/'));
        const newPreviews = imageFiles.map(file => URL.createObjectURL(file));
        setNewImageFiles(prevFiles => [...prevFiles, ...imageFiles]);
        setImagePreviews(prevPreviews => [...prevPreviews, ...newPreviews]);
    };

    const removeImage = (indexToRemove) => {
        // Cho phép xóa tự do, không kiểm tra số lượng tối thiểu ở đây
        setImagePreviews(prev => prev.filter((_, i) => i !== indexToRemove));
        if (indexToRemove < existingImages.length) {
            setExistingImages(prev => prev.filter((_, i) => i !== indexToRemove));
        } else {
            const fileIndexToRemove = indexToRemove - existingImages.length;
            setNewImageFiles(prev => prev.filter((_, i) => i !== fileIndexToRemove));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Kiểm tra ít nhất 1 ảnh khi submit
        const totalImages = existingImages.length + newImageFiles.length;
        if (totalImages < 1) {
            toast.error('Vui lòng thêm ít nhất 1 hình ảnh cho sản phẩm!');
            return;
        }
        const productFormData = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (key !== 'variants' && key !== 'specifications') {
                productFormData.append(key, value);
            }
        });
        productFormData.append('variants', JSON.stringify(formData.variants));
        productFormData.append('specifications', JSON.stringify(formData.specifications));
        newImageFiles.forEach(file => {
            productFormData.append('images', file);
        });
        if (isEditMode) {
            productFormData.append('existingImages', JSON.stringify(existingImages));
        }
        const action = isEditMode 
            ? updateAdminProduct({ id, productData: productFormData })
            : createAdminProduct(productFormData);
        dispatch(action).unwrap()
            .then(() => {
                toast.success(`Sản phẩm đã được ${isEditMode ? 'cập nhật' : 'tạo'} thành công!`);
                navigate('/admin/products');
            })
            .catch(err => {});
    };

    return (
        <>
            <style>{`.input-style { display: block; width: 100%; padding: 0.5rem 0.75rem; border: 1px solid #D1D5DB; border-radius: 0.375rem; box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05); } .input-style:focus { outline: none; border-color: #4F46E5; box-shadow: 0 0 0 1px #4F46E5; }`}</style>
            <div className="p-6">
                <h2 className="text-2xl font-bold mb-6">{isEditMode ? 'Chỉnh sửa sản phẩm' : 'Tạo sản phẩm mới'}</h2>
                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md space-y-8">
                    
                    {/* ... (Fieldset Thông tin cơ bản giữ nguyên) ... */}
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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">Giá gốc</label>
                                    <input type="number" name="price" id="price" value={formData.price} onChange={handleChange} className="mt-1 block w-full input-style" required/>
                                </div>
                                <div>
                                    <label htmlFor="brand" className="block text-sm font-medium text-gray-700">Thương hiệu</label>
                                    <input type="text" name="brand" id="brand" value={formData.brand} onChange={handleChange} className="mt-1 block w-full input-style" required/>
                                </div>
                            </div>
                        </div>
                    </fieldset>

                    {/* === SỬA FIELDSET BIẾN THỂ === */}
                    <fieldset className="border p-4 rounded-md">
                        <legend className="text-lg font-semibold px-2">Biến thể sản phẩm</legend>
                        
                        {/* Header cho bảng biến thể */}
                        <div className="hidden md:grid md:grid-cols-12 gap-4 pb-2 mb-2 border-b-2 border-gray-300 font-semibold text-sm text-gray-700">
                            <div className="col-span-3">Tên biến thể</div>
                            <div className="col-span-2">Mã SKU</div>
                            <div className="col-span-2">Số lượng</div>
                            <div className="col-span-2">Giá (VNĐ)</div>
                            <div className="col-span-2">Hình ảnh</div>
                            <div className="col-span-1"></div>
                        </div>
                        
                        <div className="space-y-4">
                            {formData.variants.map((variant, index) => (
                                // SỬA: Đổi grid-cols-10 thành grid-cols-12
                                <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-2 border-b">
                                    {/* SỬA: col-span-4 thành col-span-3 */}
                                    <input type="text" name="name" placeholder="Tên biến thể (VD: Xám, 256GB)" value={variant.name} onChange={e => handleVariantChange(index, e)} className="col-span-3 input-style" required />
                                    <input type="text" name="sku" placeholder="SKU" value={variant.sku} onChange={e => handleVariantChange(index, e)} className="col-span-2 input-style" required />
                                    <input type="number" name="stock" placeholder="Tồn kho" value={variant.stock} onChange={e => handleVariantChange(index, e)} className="col-span-2 input-style" required />
                                    {/* SỬA: col-span-1 thành col-span-2 */}
                                    <input type="number" name="price" placeholder="Giá biến thể" value={variant.price} onChange={e => handleVariantChange(index, e)} className="col-span-2 input-style" required />
                                    
                                    {/* === THÊM DROPDOWN CHỌN ẢNH === */}
                                    <select 
                                        name="imageIndex" 
                                        value={variant.imageIndex || 0} 
                                        onChange={e => handleVariantChange(index, e)} 
                                        className="col-span-2 input-style"
                                    >
                                        {/* Hiển thị các tùy chọn dựa trên số lượng ảnh đã upload/tồn tại */}
                                        {imagePreviews.length > 0 ? (
                                            imagePreviews.map((previewUrl, imgIndex) => (
                                                <option key={imgIndex} value={imgIndex}>
                                                    Ảnh {imgIndex + 1}
                                                </option>
                                            ))
                                        ) : (
                                            <option value="0">Ảnh 1</option>
                                        )}
                                    </select>
                                    {/* === KẾT THÚC THÊM === */}

                                    {/* SỬA: Thêm col-span-1 */}
                                    <button type="button" onClick={() => removeVariant(index)} className="col-span-1 text-red-500 hover:text-red-700 justify-self-center"> <FaTrash /> </button>
                                </div>
                            ))}
                        </div>
                        <button type="button" onClick={addVariant} className="mt-4 flex items-center text-sm text-blue-600 hover:text-blue-800">
                            <FaPlus className="mr-2" /> Thêm biến thể
                        </button>
                    </fieldset>
                    
                    {/* ... (Fieldset Hình ảnh, Thông số, Nút bấm giữ nguyên) ... */}
                    <fieldset className="border p-4 rounded-md">
                        <legend className="text-lg font-semibold px-2">Hình ảnh</legend>
                        <p className="text-sm text-gray-500 mb-4">Cần ít nhất 1 ảnh. {imagePreviews.length > 0 ? `Hiện có ${imagePreviews.length} ảnh.` : 'Chưa có ảnh nào.'}</p>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 mb-4">
                            {imagePreviews.map((previewUrl, index) => (
                                <div key={index} className="relative w-full h-24 border rounded-md shadow-sm">
                                    <img src={previewUrl} alt={`Preview ${index + 1}`} className="w-full h-full object-cover rounded-md" />
                                    <button type="button" onClick={() => removeImage(index)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 leading-none" aria-label="Xóa ảnh">
                                        <FaTimes size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div>
                            <label htmlFor="image-upload" className="block text-sm font-medium text-gray-700">Tải lên ảnh mới</label>
                            <input 
                                id="image-upload" type="file" multiple
                                accept="image/png, image/jpeg, image/jpg, image/webp"
                                onChange={handleImageFileChange}
                                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                        </div>
                    </fieldset>

                    <fieldset className="border p-4 rounded-md">
                        <legend className="text-lg font-semibold px-2">Thông số kỹ thuật</legend>
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label htmlFor="display" className="block text-sm font-medium text-gray-700">Màn hình</label>
                                <input type="text" name="display" id="display" placeholder="VD: 15.6 inch Full HD" value={formData.specifications.display} onChange={handleSpecificationChange} className="mt-1 block w-full input-style" />
                            </div>
                            <div>
                                <label htmlFor="processor" className="block text-sm font-medium text-gray-700">Vi xử lý (CPU)</label>
                                <input type="text" name="processor" id="processor" placeholder="VD: Intel Core i5-1135G7" value={formData.specifications.processor} onChange={handleSpecificationChange} className="mt-1 block w-full input-style" />
                            </div>
                            <div>
                                <label htmlFor="ram" className="block text-sm font-medium text-gray-700">RAM</label>
                                <input type="text" name="ram" id="ram" placeholder="VD: 8GB DDR4" value={formData.specifications.ram} onChange={handleSpecificationChange} className="mt-1 block w-full input-style" />
                            </div>
                            <div>
                                <label htmlFor="storage" className="block text-sm font-medium text-gray-700">Bộ nhớ trong</label>
                                <input type="text" name="storage" id="storage" placeholder="VD: 512GB SSD NVMe" value={formData.specifications.storage} onChange={handleSpecificationChange} className="mt-1 block w-full input-style" />
                            </div>
                            <div>
                                <label htmlFor="graphics" className="block text-sm font-medium text-gray-700">Card đồ họa</label>
                                <input type="text" name="graphics" id="graphics" placeholder="VD: NVIDIA GeForce GTX 1650" value={formData.specifications.graphics} onChange={handleSpecificationChange} className="mt-1 block w-full input-style" />
                            </div>
                            <div>
                                <label htmlFor="battery" className="block text-sm font-medium text-gray-700">Pin</label>
                                <input type="text" name="battery" id="battery" placeholder="VD: 56Wh" value={formData.specifications.battery} onChange={handleSpecificationChange} className="mt-1 block w-full input-style" />
                            </div>
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