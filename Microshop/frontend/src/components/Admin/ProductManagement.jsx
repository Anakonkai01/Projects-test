import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAdminProducts,
  deleteAdminProduct,
} from "../../features/admin/adminProductSlice";
// ✨ QUAN TRỌNG: Import fetchProducts từ productSlice
import { fetchProducts } from "../../features/products/productSlice"; 
import { toast } from "sonner"; // Hoặc "react-toastify" tùy bạn dùng
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Pagination from "../Common/Pagination";

const ProductManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, pagination, isLoading } = useSelector(
    (state) => state.adminProducts
  );
  const [currentPage, setCurrentPage] = useState(1);

  // Chỉ giữ lại useEffect này để tải danh sách admin
  useEffect(() => {
    dispatch(getAdminProducts(`?page=${currentPage}`));
  }, [dispatch, currentPage]);

  // ✨ SỬA LẠI HÀM NÀY ✨
  const handleDelete = (product) => { // <-- Nhận vào toàn bộ 'product'
    if (window.confirm("Bạn có chắc muốn xóa sản phẩm này không?")) {
      dispatch(deleteAdminProduct(product._id)) // Dùng product._id để xóa
        .unwrap()
        .then(() => {
          // 1. Hiển thị thông báo thành công
          toast.success("Xóa sản phẩm thành công!");

          // 2. Tải lại danh sách cho trang Admin (để list admin tự cập nhật)
          dispatch(getAdminProducts(`?page=${currentPage}`));

          // === PHẦN THÊM VÀO ĐỂ FIX LỖI TRANG HOME ===
          // 3. Tải lại các danh sách chung cho trang Home
          console.log("Đang re-fetch Hàng Mới Về và Bán Chạy Nhất...");
          dispatch(
            fetchProducts({ query: "?sort=-createdAt&limit=4", type: "newProducts" })
          );
          dispatch(
            fetchProducts({ query: "?sort=-sold&limit=4", type: "bestSellers" })
          );

          // 4. Tải lại danh sách theo brand/category cho trang Home
          // Giả sử bạn dùng 'brand'
          console.log(`Sản phẩm thuộc brand: ${product.brand}. Đang re-fetch brand đó...`);
          if (product.brand === 'Apple') {
            dispatch(fetchProducts({ query: "?brand=Apple&limit=4", type: "laptops" }));
          }
          if (product.brand === 'Samsung') {
            dispatch(fetchProducts({ query: "?brand=Samsung&limit=4", type: "phones" }));
          }
          // Hoặc nếu bạn dùng 'category' (thay thế hoặc bổ sung)
          // console.log(`Sản phẩm thuộc category: ${product.category?.name || product.category}. Đang re-fetch category đó...`);
          // if (product.category === 'ID_CUA_LAPTOP') { // Thay 'ID_CUA_LAPTOP' bằng ID thực tế
          //   dispatch(fetchProducts({ query: "?category=ID_CUA_LAPTOP&limit=4", type: "laptops" }));
          // }
          // if (product.category === 'ID_CUA_PHONE') { // Thay 'ID_CUA_PHONE' bằng ID thực tế
          //   dispatch(fetchProducts({ query: "?category=ID_CUA_PHONE&limit=4", type: "phones" }));
          // }
          // Thêm các brand/category khác nếu có...
          // === KẾT THÚC PHẦN THÊM VÀO ===

        })
        .catch((err) => toast.error(err.message || "Có lỗi xảy ra."));
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  if (isLoading && products.length === 0) return <p className="text-center mt-8">Loading products...</p>; // Thêm kiểm tra products.length

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Product Management</h2>
        <button
          onClick={() => navigate("/admin/products/new")}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center"
        >
          <FaPlus className="mr-2" /> Thêm sản phẩm
        </button>
      </div>

      <div className="overflow-x-auto shadow-md sm:rounded-lg bg-white">
        <table className="min-w-full text-left text-sm text-gray-700">
          <thead className="bg-gray-50 text-xs uppercase">
            <tr>
              <th className="py-3 px-6">Ảnh</th>
              <th className="py-3 px-6">Tên sản phẩm</th>
              <th className="py-3 px-6">Giá</th>
              <th className="py-3 px-6">Tồn kho</th>
              <th className="py-3 px-6">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {/* ✨ QUAN TRỌNG: Kiểm tra nếu products không phải là mảng */}
            {Array.isArray(products) && products.map((product) => ( 
              <tr key={product._id} className="border-b hover:bg-gray-50">
                <td className="py-4 px-6">
                  <img
                    src={product.images[0]?.url}
                    alt={product.name}
                    className="h-12 w-12 object-cover rounded"
                  />
                </td>
                <td className="py-4 px-6 font-medium">{product.name}</td>
                <td className="py-4 px-6">{formatPrice(product.price)}</td>
                <td className="py-4 px-6">
                  {/* Kiểm tra product.variants có tồn tại và là mảng không */}
                  {Array.isArray(product.variants) ? product.variants.reduce((total, v) => total + (v.stock || 0), 0) : 0} 
                </td>
                <td className="py-4 px-6 flex items-center space-x-3">
                  <button
                    onClick={() =>
                      navigate(`/admin/products/edit/${product._id}`)
                    }
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <FaEdit size={18} />
                  </button>
                  <button
                    // ✨ SỬA LỖI Ở ĐÂY: Truyền vào 'product' thay vì 'product._id' ✨
                    onClick={() => handleDelete(product)} 
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
      </div>
      <Pagination
          currentPage={pagination?.currentPage || 1}
          totalPages={pagination?.totalPages || 1}
          onPageChange={(page) => setCurrentPage(page)}
        />
    </div>
  );
};

export default ProductManagement;