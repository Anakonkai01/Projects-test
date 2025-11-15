import React, { useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../features/products/productSlice";
import ProductCard from "../components/Products/ProductCard";
import ProductSection from "../components/Products/ProductSection"; // Để dùng bộ khung loading
import FilterSidebar from "../components/Products/FilterSidebar";
import Pagination from "../components/Common/Pagination";
import SortOptions from "../components/Products/SortOptions";
const Shop = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  // Lấy state từ productSlice, nhưng đổi tên để tránh nhầm lẫn
  const { products: shopProducts,pagination, isLoading } = useSelector(
    (state) => state.products
  );

  // useMemo để tạo query string chỉ khi searchParams thay đổi
  const queryString = useMemo(() => {
    // Chuyển searchParams thành một query string http
    return "?" + searchParams.toString();
  }, [searchParams]);

  useEffect(() => {
    // Gọi fetchProducts với query string và một 'type' mới là 'products'
    // để nó lưu vào state.products trong productSlice
    dispatch(fetchProducts({ query: queryString, type: "products" }));
  }, [dispatch, queryString]);

  const handlePageChange = (page) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", page);
    setSearchParams(newParams);
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Cửa hàng</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Cột 1: Filter Sidebar */}
        <FilterSidebar />

        {/* Cột 2: Product Grid */}
        <main className="w-full">
          <SortOptions />
          {isLoading && shopProducts.length === 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="border rounded-lg shadow-sm bg-white p-4"
                >
                  <div className="bg-gray-200 h-48 w-full animate-pulse"></div>
                  <div className="mt-4">
                    <div className="bg-gray-200 h-6 w-3/4 animate-pulse mb-2"></div>
                    <div className="bg-gray-200 h-4 w-1/2 animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {shopProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          {!isLoading && shopProducts.length === 0 && (
            <p className="text-center text-gray-500 mt-8 text-xl">
              Không tìm thấy sản phẩm nào phù hợp.
            </p>
          )}
          <Pagination
            currentPage={pagination?.currentPage || 1}
            totalPages={pagination?.totalPages || 1}
            onPageChange={handlePageChange}
          />
        </main>
      </div>
    </div>
  );
};

export default Shop;
