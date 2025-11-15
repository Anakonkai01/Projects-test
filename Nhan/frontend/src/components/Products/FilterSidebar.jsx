import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import adminProductService from '../../features/admin/adminProductService'; // Tái sử dụng service này

const FilterSidebar = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [categories, setCategories] = useState([]);

    // State cục bộ để giữ các giá trị lọc trước khi áp dụng
    const [filters, setFilters] = useState({
        category: searchParams.get('category') || '',
        'price[gte]': searchParams.get('price[gte]') || '',
        'price[lte]': searchParams.get('price[lte]') || '',
    });

    // Fetch danh mục khi component được tạo
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const fetchedCategories = await adminProductService.getCategories();
                setCategories(fetchedCategories);
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            }
        };
        fetchCategories();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleApplyFilters = (e) => {
        e.preventDefault();
        const newParams = new URLSearchParams(searchParams);

        // Cập nhật hoặc xóa các tham số dựa trên giá trị của filters
        Object.entries(filters).forEach(([key, value]) => {
            if (value) {
                newParams.set(key, value);
            } else {
                newParams.delete(key);
            }
        });

        setSearchParams(newParams);
    };
    
    const handleClearFilters = () => {
        const newParams = new URLSearchParams(searchParams);
        // Chỉ xóa các key liên quan đến filter, giữ lại keyword
        newParams.delete('category');
        newParams.delete('price[gte]');
        newParams.delete('price[lte]');
        setSearchParams(newParams);
        setFilters({
            category: '',
            'price[gte]': '',
            'price[lte]': '',
        });
    }

    return (
        <aside className="w-full md:w-1/4 lg:w-1/5 p-4">
            <form onSubmit={handleApplyFilters}>
                <h3 className="font-bold text-xl mb-4 border-b pb-2">Bộ lọc</h3>

                {/* Lọc theo danh mục */}
                <div className="mb-6">
                    <h4 className="font-semibold mb-2">Danh mục</h4>
                    <select
                        name="category"
                        value={filters.category}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-md"
                    >
                        <option value="">Tất cả</option>
                        {categories.map(cat => (
                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                        ))}
                    </select>
                </div>

                {/* Lọc theo khoảng giá */}
                <div className="mb-6">
                    <h4 className="font-semibold mb-2">Khoảng giá</h4>
                    <div className="flex items-center space-x-2">
                        <input
                            type="number"
                            name="price[gte]"
                            placeholder="Từ"
                            value={filters['price[gte]']}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-md"
                        />
                        <span>-</span>
                        <input
                            type="number"
                            name="price[lte]"
                            placeholder="Đến"
                            value={filters['price[lte]']}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-md"
                        />
                    </div>
                </div>

                {/* Các nút hành động */}
                <div className="space-y-2">
                     <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
                        Áp dụng
                    </button>
                    <button type="button" onClick={handleClearFilters} className="w-full bg-gray-200 text-gray-700 py-2 rounded-md hover:bg-gray-300">
                        Xóa bộ lọc
                    </button>
                </div>
            </form>
        </aside>
    );
};

export default FilterSidebar;