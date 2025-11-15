import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
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
        </div>

        <div className="p-4 flex flex-col flex-grow">
          <p className="text-xs text-gray-500 uppercase mb-1">
            {product.brand || "Thương hiệu"}
          </p>

          <h3 className="text-sm font-semibold text-gray-800 mb-2 h-10 line-clamp-2">
            {product.name}
          </h3>

          <div className="mt-auto">
            <p className="text-lg font-bold text-red-600">
              {formatPrice(product.price)}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default React.memo(ProductCard);