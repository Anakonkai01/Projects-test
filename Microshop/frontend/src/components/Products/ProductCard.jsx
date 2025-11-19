import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FaShoppingCart, FaBolt } from "react-icons/fa";
import { toast } from "sonner";
import { addToCart } from "../../features/cart/cartSlice";
import StarRating from "./StarRating";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const formatPrice = (price) => {
    if (typeof price !== "number") {
      return "N/A";
    }
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const displayImage =
    product.images?.[0]?.url || "https://via.placeholder.com/300";

  // Lấy variant đầu tiên làm mặc định
  const defaultVariant = product.variants?.[0];

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!defaultVariant) {
      toast.error("Sản phẩm không có phiên bản khả dụng!");
      return;
    }

    if (defaultVariant.stock <= 0) {
      toast.error("Sản phẩm đã hết hàng!");
      return;
    }

    const itemToAdd = {
      _id: product._id,
      name: product.name,
      price: defaultVariant.price,
      image: displayImage,
      variant: defaultVariant,
      quantity: 1
    };

    dispatch(addToCart(itemToAdd));
  };

  const handleBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!defaultVariant) {
      toast.error("Sản phẩm không có phiên bản khả dụng!");
      return;
    }

    if (defaultVariant.stock <= 0) {
      toast.error("Sản phẩm đã hết hàng!");
      return;
    }

    const itemToAdd = {
      _id: product._id,
      name: product.name,
      price: defaultVariant.price,
      image: displayImage,
      variant: defaultVariant,
      quantity: 1
    };

    // Thêm vào giỏ hàng trước
    dispatch(addToCart(itemToAdd));
    
    // Chuyển đến trang checkout
    setTimeout(() => {
      navigate('/checkout');
    }, 500);
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group bg-white flex flex-col h-full">
      <Link
        to={`/product/${product._id}`}
        className="flex flex-col flex-grow"
        title={product.name}
      >
        <div className="relative overflow-hidden h-48 sm:h-56">
          <img
            src={displayImage}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          {defaultVariant && defaultVariant.stock <= 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-bold text-lg">Hết hàng</span>
            </div>
          )}
        </div>

        <div className="p-4 flex flex-col flex-grow">
          <p className="text-xs text-gray-500 uppercase mb-1">
            {product.brand || "Thương hiệu"}
          </p>

          <h3 className="text-sm font-semibold text-gray-800 mb-2 h-10 line-clamp-2">
            {product.name}
          </h3>

          {/* Hiển thị rating */}
          <div className="flex items-center gap-2 mb-2">
            <StarRating rating={product.ratings || 0} size={16} />
            <span className="text-xs text-gray-500">
              ({product.numOfReviews || 0})
            </span>
          </div>

          <div className="mt-auto">
            <p className="text-lg font-bold text-red-600 mb-3">
              {formatPrice(product.price)}
            </p>
          </div>
        </div>
      </Link>

      {/* Nút hành động */}
      <div className="px-4 pb-4 flex gap-2">
        <button
          onClick={handleAddToCart}
          disabled={!defaultVariant || defaultVariant.stock <= 0}
          className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed"
          title="Thêm vào giỏ hàng"
        >
          <FaShoppingCart size={14} />
          <span className="hidden sm:inline">Thêm</span>
        </button>
        <button
          onClick={handleBuyNow}
          disabled={!defaultVariant || defaultVariant.stock <= 0}
          className="flex-1 bg-orange-500 text-white py-2 px-3 rounded-md hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 text-sm font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed"
          title="Mua ngay"
        >
          <FaBolt size={14} />
          <span className="hidden sm:inline">Mua ngay</span>
        </button>
      </div>
    </div>
  );
};

export default React.memo(ProductCard);