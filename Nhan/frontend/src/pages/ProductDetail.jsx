// Nhan/frontend/src/pages/ProductDetail.jsx
import React, { useEffect, useState } from 'react';
// SỬA: Thêm useNavigate và useLocation
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom'; 
import { useDispatch, useSelector } from 'react-redux';
import { getProductById, resetProduct } from '../features/products/productSlice';
import { addToCart } from '../features/cart/cartSlice';
import ProductReviews from '../components/Products/ProductReviews'; 
import StarRating from '../components/Products/StarRating';
import { FaMinus, FaPlus } from 'react-icons/fa';
import { toast } from 'sonner';

const ProductDetail = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    
    // SỬA: Thêm các hook điều hướng
    const navigate = useNavigate();
    const location = useLocation(); // Dùng để lấy đường dẫn hiện tại

    const { product, isLoading, isError, message } = useSelector((state) => state.products);
    const { user } = useSelector((state) => state.auth);
    
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        if (id) {
            dispatch(getProductById(id));
        }
        return () => {
            dispatch(resetProduct());
        };
    }, [id, dispatch]);
    
    useEffect(() => {
        if (product && product.variants.length > 0) {
            setSelectedVariant(product.variants[0]);
        }
    }, [product]);

    // Hàm này giữ nguyên, CHỈ DÀNH CHO NÚT "Thêm vào giỏ hàng"
    const handleAddToCart = () => {
        if (!selectedVariant) {
            toast.error("Vui lòng chọn một phiên bản");
            return;
        }
        const itemToAdd = {
            _id: product._id,
            name: product.name,
            price: selectedVariant.price,
            image: product.images[0]?.url,
            variant: selectedVariant,
            quantity: Number(quantity)
        };
        dispatch(addToCart(itemToAdd));
    };

    // ... (Phần kiểm tra loading/error giữ nguyên) ...
    if (isLoading || !product) {
        return <div className="text-center p-10">Loading...</div>;
    }
    if (isError) {
        return <div className="text-center p-10 text-red-500 font-semibold">Lỗi: {message}</div>;
    }

    const displayPrice = selectedVariant ? selectedVariant.price : product.price;
    
    const buyNowItem = selectedVariant ? {
        _id: product._id,
        name: product.name,
        price: selectedVariant.price,
        image: product.images[0]?.url,
        variant: selectedVariant,
        quantity: Number(quantity)
    } : null;

    // SỬA: Tạo hàm xử lý cho nút "Mua ngay"
    const handleBuyNow = () => {
        // 1. Kiểm tra phiên bản
        if (!selectedVariant) {
            toast.error("Vui lòng chọn một phiên bản để mua ngay");
            return;
        }

        // 2. Kiểm tra đăng nhập
        if (user) {
            // Đã đăng nhập: Tới trang checkout
            navigate('/checkout', { state: { item: buyNowItem } });
        } else {
            // Là guest: Bắt đăng nhập
            toast.info("Vui lòng đăng nhập để tiếp tục mua hàng");
            // Điều hướng đến trang login và lưu lại trang hiện tại (location.pathname)
            // để trang Login biết đường quay lại sau khi đăng nhập thành công.
            navigate(`/login?redirect=${location.pathname}`);
        }
    };

    return (
        <div className="container mx-auto my-12 p-4">
            {/* ... (Tất cả JSX từ đầu đến phần nút bấm giữ nguyên) ... */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <img src={product.images[0]?.url} alt={product.name} className="w-full rounded-lg shadow-lg" />
                </div>

                <div>
                    <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                    <div className="flex items-center gap-2 mb-4">
                        <StarRating rating={product.ratings} size={20} />
                        <span className="text-gray-600">({product.numOfReviews} đánh giá)</span>
                    </div>
                    <p className="text-2xl text-red-600 font-semibold mb-4">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(displayPrice)}
                    </p>

                    <div className="mb-6">
                        <h3 className="font-semibold mb-2">Chọn phiên bản:</h3>
                        <div className="flex flex-wrap gap-2">
                            {product.variants.map(variant => (
                                <button 
                                    key={variant._id}
                                    onClick={() => {
                                        setSelectedVariant(variant);
                                        setQuantity(1);
                                    }}
                                    className={`px-4 py-2 border rounded-md transition-colors ${selectedVariant?._id === variant._id ? 'bg-blue-600 text-white border-blue-600' : 'bg-white hover:border-gray-500'}`}
                                >
                                    {variant.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mb-6 flex items-center gap-4">
                        <h3 className="font-semibold">Số lượng:</h3>
                        <div className="flex items-center border rounded-md">
                            <button 
                                type="button"
                                onClick={() => setQuantity(Number(quantity) <= 1 ? 1 : Number(quantity) - 1)}
                                className="px-3 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-l-md"
                                disabled={Number(quantity) <= 1}
                                aria-label="Giảm số lượng"
                            >
                                <FaMinus size={14} />
                            </button>
                            
                            <input 
                                type="number" 
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                min="1"
                                className="px-2 py-1 text-center font-medium w-16 border-l border-r
                                           [appearance:textfield] 
                                           [&::-webkit-outer-spin-button]:appearance-none 
                                           [&::-webkit-inner-spin-button]:appearance-none
                                           focus:outline-none"
                            />

                            <button 
                                type="button"
                                onClick={() => setQuantity(Number(quantity) + 1)}
                                className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-r-md"
                                aria-label="Tăng số lượng"
                            >
                                <FaPlus size={14} />
                            </button>
                        </div>
                    </div>

                    <div className="mb-6">
                        <h3 className="font-semibold mb-2">Mô tả:</h3>
                        <p className="text-gray-700">{product.description}</p>
                    </div>

                    {/* === SỬA PHẦN NÚT BẤM === */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* 1. Nút Thêm vào giỏ hàng (chỉ user mới thấy) */}
                        {user && (
                            <button 
                                onClick={handleAddToCart}
                                className="w-full sm:w-1/2 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={!selectedVariant} // Vô hiệu hóa nếu chưa chọn
                            >
                                Thêm vào giỏ hàng
                            </button>
                        )}

                        {/* 2. Nút Mua ngay (Sửa <Link> thành <button>) */}
                        <button 
                            onClick={handleBuyNow} // <-- SỬA DÙNG HANDLER MỚI
                            className={`w-full ${user ? 'sm:w-1/2' : 'sm:w-full'} bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors text-center ${!selectedVariant ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            Mua ngay
                        </button>
                    </div>
                    {/* === KẾT THÚC SỬA === */}
                </div>
            </div>
            {/* ... (Phần ProductReviews giữ nguyên) ... */}
            <div className="mt-12 border-t pt-8">
                <ProductReviews productId={product._id} />
            </div>
        </div>
    );
};

export default ProductDetail;