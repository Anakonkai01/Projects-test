import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import adminProductService from '../../features/admin/adminProductService';
import axios from '../../utils/axios';

const FilterSidebar = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [brands, setBrands] = useState([]);

    // State cục bộ để giữ các giá trị lọc trước khi áp dụng
    const [filters, setFilters] = useState({
        brand: searchParams.get('brand') || '',
        ram: searchParams.get('ram') || '',
        storage: searchParams.get('storage') || '',
        priceRange: searchParams.get('priceRange') || '',
        'ratings[gte]': searchParams.get('ratings[gte]') || '',
        sort: searchParams.get('sort') || '',
    });

    // Fetch brands khi component được tạo
    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const response = await axios.get('/products/brands/all');
                console.log('Brands response:', response.data);
                const fetchedBrands = response.data.data || [];
                setBrands(fetchedBrands);
                if (fetchedBrands.length === 0) {
                    console.warn('No brands found in response');
                }
            } catch (error) {
                console.error("Failed to fetch brands:", error);
                console.error("Error details:", error.response?.data);
                toast.error("Không thể tải danh sách thương hiệu");
            }
        };
        fetchBrands();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleApplyFilters = (e) => {
        e.preventDefault();

        const newParams = new URLSearchParams(searchParams);

        // Xử lý khoảng giá
        if (filters.priceRange) {
            const [min, max] = filters.priceRange.split('-');
            if (min) newParams.set('price[gte]', min);
            if (max && max !== 'plus') {
                newParams.set('price[lte]', max);
            } else if (max === 'plus') {
                newParams.delete('price[lte]');
            }
        } else {
            newParams.delete('price[gte]');
            newParams.delete('price[lte]');
        }

        // Xử lý các filter khác
        ['brand', 'ram', 'storage', 'ratings[gte]', 'sort'].forEach(key => {
            if (filters[key]) {
                newParams.set(key, filters[key]);
            } else {
                newParams.delete(key);
            }
        });

        // Xóa priceRange khỏi URL (chỉ dùng price[gte] và price[lte])
        newParams.delete('priceRange');

        setSearchParams(newParams);
        toast.success('Đã áp dụng bộ lọc!');
    };
    
    const handleClearFilters = () => {
        const newParams = new URLSearchParams(searchParams);
        // Chỉ xóa các key liên quan đến filter, giữ lại keyword
        ['brand', 'ram', 'storage', 'priceRange', 'price[gte]', 'price[lte]', 'ratings[gte]', 'sort'].forEach(key => {
            newParams.delete(key);
        });
        setSearchParams(newParams);
        setFilters({
            brand: '',
            ram: '',
            storage: '',
            priceRange: '',
            'ratings[gte]': '',
            sort: '',
        });
        toast.success('Đã xóa bộ lọc!');
    }

    return (
        <aside className="w-full md:w-1/4 lg:w-1/5 p-4 bg-gray-50 rounded-lg">
            <form onSubmit={handleApplyFilters}>
                <h3 className="font-bold text-xl mb-4 border-b pb-2">Bộ lọc</h3>

                {/* Bỏ phần lọc theo danh mục vì chỉ có 1 loại sản phẩm */}

                {/* Lọc theo thương hiệu */}
                <div className="mb-6">
                    <h4 className="font-semibold mb-2">Thương hiệu</h4>
                    <select
                        name="brand"
                        value={filters.brand}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Tất cả</option>
                        {brands.map((brand, index) => (
                            <option key={index} value={brand}>{brand}</option>
                        ))}
                    </select>
                </div>

                {/* Lọc theo RAM */}
                <div className="mb-6">
                    <h4 className="font-semibold mb-2">RAM</h4>
                    <select
                        name="ram"
                        value={filters.ram}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Tất cả</option>
                        <option value="4GB">4GB</option>
                        <option value="6GB">6GB</option>
                        <option value="8GB">8GB</option>
                        <option value="12GB">12GB</option>
                        <option value="16GB">16GB trở lên</option>
                    </select>
                </div>

                {/* Lọc theo bộ nhớ */}
                <div className="mb-6">
                    <h4 className="font-semibold mb-2">Bộ nhớ</h4>
                    <select
                        name="storage"
                        value={filters.storage}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Tất cả</option>
                        <option value="64GB">64GB</option>
                        <option value="128GB">128GB</option>
                        <option value="256GB">256GB</option>
                        <option value="512GB">512GB</option>
                        <option value="1TB">1TB trở lên</option>
                    </select>
                </div>

                {/* Lọc theo khoảng giá */}
                <div className="mb-6">
                    <h4 className="font-semibold mb-2">Khoảng giá (VNĐ)</h4>
                    <select
                        name="priceRange"
                        value={filters.priceRange}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Tất cả</option>
                        <option value="0-3000000">Dưới 3 triệu</option>
                        <option value="3000000-5000000">3 - 5 triệu</option>
                        <option value="5000000-7000000">5 - 7 triệu</option>
                        <option value="7000000-10000000">7 - 10 triệu</option>
                        <option value="10000000-15000000">10 - 15 triệu</option>
                        <option value="15000000-20000000">15 - 20 triệu</option>
                        <option value="20000000-plus">Trên 20 triệu</option>
                    </select>
                </div>

                {/* Lọc theo đánh giá */}
                <div className="mb-6">
                    <h4 className="font-semibold mb-2">Đánh giá tối thiểu</h4>
                    <select
                        name="ratings[gte]"
                        value={filters['ratings[gte]']}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Tất cả</option>
                        <option value="4">⭐ 4 sao trở lên</option>
                        <option value="3">⭐ 3 sao trở lên</option>
                        <option value="2">⭐ 2 sao trở lên</option>
                        <option value="1">⭐ 1 sao trở lên</option>
                    </select>
                </div>

                {/* Sắp xếp */}
                <div className="mb-6">
                    <h4 className="font-semibold mb-2">Sắp xếp theo</h4>
                    <select
                        name="sort"
                        value={filters.sort}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Mặc định</option>
                        <option value="price">Giá: Thấp đến cao</option>
                        <option value="-price">Giá: Cao đến thấp</option>
                        <option value="-ratings">Đánh giá cao nhất</option>
                        <option value="-sold">Bán chạy nhất</option>
                        <option value="-createdAt">Mới nhất</option>
                    </select>
                </div>

                {/* Các nút hành động */}
                <div className="space-y-2">
                     <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors font-semibold">
                        Áp dụng
                    </button>
                    <button type="button" onClick={handleClearFilters} className="w-full bg-gray-200 text-gray-700 py-3 rounded-md hover:bg-gray-300 transition-colors font-semibold">
                        Xóa bộ lọc
                    </button>
                </div>
            </form>
        </aside>
    );
};

export default FilterSidebar;