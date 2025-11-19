// Nhan/frontend/src/pages/ProductDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom'; 
import { useDispatch, useSelector } from 'react-redux';
import { getProductById, resetProduct } from '../features/products/productSlice';
import { addToCart } from '../features/cart/cartSlice';
import ProductReviews from '../components/Products/ProductReviews'; 
import StarRating from '../components/Products/StarRating';
import { FaMinus, FaPlus } from 'react-icons/fa';
import { toast } from 'sonner';

// THÊM: Helper để map tên thông số
const specLabels = {
    display: "Màn hình",
    processor: "Vi xử lý (CPU)",
    ram: "RAM",
    storage: "Bộ nhớ trong",
    graphics: "Card đồ họa",
    battery: "Pin",
};

const ProductDetail = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation(); 

    const { product, isLoading, isError, message } = useSelector((state) => state.products);
    const { user } = useSelector((state) => state.auth);
    
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [displayImage, setDisplayImage] = useState('');

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
            const defaultVariant = product.variants[0];
            setSelectedVariant(defaultVariant);
            
            const defaultImageUrl = product.images[(defaultVariant.imageIndex || 0)]?.url;
            setDisplayImage(defaultImageUrl || product.images[0]?.url); 
        }
    }, [product]); 

    useEffect(() => {
        if (selectedVariant && product && product.images) { 
            const imageIndex = selectedVariant.imageIndex || 0;
            const newImageUrl = product.images[imageIndex]?.url;
            
            if (newImageUrl) {
                setDisplayImage(newImageUrl);
            }
        }
    }, [selectedVariant, product]);

    const handleAddToCart = () => {
        if (!selectedVariant) {
            toast.error("Vui lòng chọn một phiên bản");
            return;
        }
        const itemToAdd = {
            _id: product._id,
            name: product.name,
            price: selectedVariant.price,
            image: displayImage, 
            variant: selectedVariant,
            quantity: Number(quantity)
        };
        dispatch(addToCart(itemToAdd));
    };

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
        image: displayImage,
        variant: selectedVariant,
        quantity: Number(quantity)
    } : null;

    const handleBuyNow = () => {
        if (!selectedVariant) {
            toast.error("Vui lòng chọn một phiên bản để mua ngay");
            return;
        }
        if (user) {
            navigate('/checkout', { state: { item: buyNowItem } });
        } else {
            toast.info("Vui lòng đăng nhập để tiếp tục mua hàng");
            navigate(`/login?redirect=${location.pathname}`);
        }
    };
    
    // THÊM: Biến kiểm tra xem có thông số nào không
    const hasSpecifications = product.specifications && Object.values(product.specifications).some(val => val);

    return (
        <div className="container mx-auto my-12 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <img src={displayImage || product.images[0]?.url} alt={product.name} className="w-full rounded-lg shadow-lg" />
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

                    {/* === THÊM PHẦN THÔNG SỐ KỸ THUẬT === */}
                    {hasSpecifications && (
                        <div className="mb-6 border-t pt-6">
                            <h3 className="font-semibold mb-4 text-lg">Thông số kỹ thuật</h3>
                            <table className="w-full text-sm">
                                <tbody>
                                    {Object.entries(specLabels).map(([key, label]) => (
                                        // Chỉ render nếu product.specifications TỒN TẠI VÀ có giá trị cho key đó
                                        product.specifications[key] && (
                                            <tr key={key} className="border-b last:border-b-0 bg-gray-50 even:bg-white">
                                                <td className="py-3 px-4 font-medium text-gray-500">{label}</td>
                                                <td className="py-3 px-4 text-gray-800">{product.specifications[key]}</td>
                                            </tr>
                                        )
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    {/* === KẾT THÚC THÊM === */}


                    <div className="flex flex-col sm:flex-row gap-4">
                        {user && (
                            <button 
                                onClick={handleAddToCart}
                                className="w-full sm:w-1/2 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={!selectedVariant}
                            >
                                Thêm vào giỏ hàng
                            </button>
                        )}

                        <button 
                            onClick={handleBuyNow} 
                            className={`w-full ${user ? 'sm:w-1/2' : 'sm:w-full'} bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors text-center ${!selectedVariant ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            Mua ngay
                        </button>
                    </div>
                </div>
            </div>
            
            <div className="mt-12 border-t pt-8">
                <ProductReviews productId={product._id} />
            </div>
        </div>
    );
};

export default ProductDetail;